;; Paxlot Income Distribution Contract
;; Handles rental income distribution to fractional property token holders

;; --------------------
;; Admin Control
;; --------------------
(define-data-var admin principal tx-sender)

;; --------------------
;; Constants
;; --------------------
(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NOT-REGISTERED u101)
(define-constant ERR-NO-TOKENS u102)
(define-constant ERR-INVALID-INPUT u103)

;; --------------------
;; Storage Maps
;; --------------------
;; Property ID to total supply of tokens
(define-map property-supply ((property-id uint)) uint)

;; Balance per property per user
(define-map balances ((property-id uint) (owner principal)) uint)

;; Accumulated rental income per property
(define-map property-income ((property-id uint)) uint)

;; --------------------
;; Events
;; --------------------
(define-event income-distributed (property-id uint) (amount uint))
(define-event income-claimed (property-id uint) (owner principal) (amount uint))

;; --------------------
;; Internal Checks
;; --------------------
(define-private (is-admin)
  (is-eq tx-sender (var-get admin))
)

;; --------------------
;; Admin Functions
;; --------------------
(define-public (transfer-admin (new-admin principal))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set admin new-admin)
    (ok true)
  )
)

;; Register a new property token supply
(define-public (register-property (property-id uint) (total-supply uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (asserts! (> total-supply u0) (err ERR-INVALID-INPUT))
    (asserts! (is-none (map-get? property-supply {property-id: property-id})) (err ERR-NOT-REGISTERED))
    (map-set property-supply {property-id: property-id} total-supply)
    (ok true)
  )
)

;; Set user balance for a property
(define-public (set-balance (property-id uint) (owner principal) (amount uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (map-set balances {property-id: property-id, owner: owner} amount)
    (ok true)
  )
)

;; Deposit rental income for a property
(define-public (deposit-income (property-id uint) (amount uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (let ((existing (default-to u0 (map-get? property-income {property-id: property-id}))))
      (map-set property-income {property-id: property-id} (+ existing amount))
      (emit-event (income-distributed property-id amount))
      (ok true)
    )
  )
)

;; --------------------
;; Public User Functions
;; --------------------

;; Claim a user's share of income for a property
(define-public (claim-income (property-id uint))
  (let (
        (user-balance (default-to u0 (map-get? balances {property-id: property-id, owner: tx-sender})))
        (total-supply (map-get? property-supply {property-id: property-id}))
        (total-income (default-to u0 (map-get? property-income {property-id: property-id})))
      )
    (begin
      (asserts! (> user-balance u0) (err ERR-NO-TOKENS))
      (match total-supply
        total-supply-val
          (let (
                (claim-amount (/ (* total-income user-balance) total-supply-val))
              )
            (begin
              (map-set property-income {property-id: property-id} (- total-income claim-amount))
              (emit-event (income-claimed property-id tx-sender claim-amount))
              (ok claim-amount)
            )
          )
        (err ERR-NOT-REGISTERED)
      )
    )
  )
)

;; Read-only: Check user's claimable income
(define-read-only (get-claimable (property-id uint) (owner principal))
  (let (
        (user-balance (default-to u0 (map-get? balances {property-id: property-id, owner: owner})))
        (total-supply (map-get? property-supply {property-id: property-id}))
        (total-income (default-to u0 (map-get? property-income {property-id: property-id})))
      )
    (if (is-none total-supply)
        (err ERR-NOT-REGISTERED)
        (ok (/ (* total-income user-balance) (unwrap! total-supply (err ERR-INVALID-INPUT))))
    )
  )
)
