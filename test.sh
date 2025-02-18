#!/bin/bash

API="http://localhost:5000/api"
echo "=== Test Script for E-commerce API (Minecraft Theme) ==="

echo
echo "1) Create Product (Diamond Sword)"
RESPONSE_PRODUCT=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Diamond Sword","description":"A mighty blade","price":100,"stock":3}' \
  "$API/products")
echo "Response: $RESPONSE_PRODUCT"
PRODUCT_ID=$(echo $RESPONSE_PRODUCT | grep -o '"_id":"[^"]*' | head -1 | cut -d':' -f2 | tr -d '"')
echo "PRODUCT_ID = $PRODUCT_ID"

echo
echo "2) Get All Products"
curl -s -X GET "$API/products"
echo

echo
echo "3) Get Product by ID"
curl -s -X GET "$API/products/$PRODUCT_ID"
echo

echo
echo "4) Update Product (Change price to 120)"
curl -s -X PUT -H "Content-Type: application/json" \
  -d '{"price":120,"stock":2}' \
  "$API/products/$PRODUCT_ID"
echo

echo
echo "5) Delete Product"
curl -s -X DELETE "$API/products/$PRODUCT_ID"
echo

echo
echo "6) Create Customer"
RESPONSE_CUSTOMER=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Steve","email":"steve@minecraft.com","address":"Overworld"}' \
  "$API/customers")
echo "Response: $RESPONSE_CUSTOMER"
CUSTOMER_ID=$(echo $RESPONSE_CUSTOMER | grep -o '"_id":"[^"]*' | head -1 | cut -d':' -f2 | tr -d '"')
echo "CUSTOMER_ID = $CUSTOMER_ID"

echo
echo "7) Get All Customers"
curl -s -X GET "$API/customers"
echo

echo
echo "8) Create Another Product (Redstone Dust)"
RESPONSE_PRODUCT_2=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"Redstone Dust","price":5,"stock":64}' \
  "$API/products")
echo "Response: $RESPONSE_PRODUCT_2"
PRODUCT_ID_2=$(echo $RESPONSE_PRODUCT_2 | grep -o '"_id":"[^"]*' | head -1 | cut -d':' -f2 | tr -d '"')
echo "PRODUCT_ID_2 = $PRODUCT_ID_2"

echo
echo "9) Create Order"
RESPONSE_ORDER=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"customer\":\"$CUSTOMER_ID\",\"products\":[\"$PRODUCT_ID_2\"]}" \
  "$API/orders")
echo "Response: $RESPONSE_ORDER"
ORDER_ID=$(echo $RESPONSE_ORDER | grep -o '"_id":"[^"]*' | head -1 | cut -d':' -f2 | tr -d '"')
echo "ORDER_ID = $ORDER_ID"

echo
echo "10) Get Order by ID"
curl -s -X GET "$API/orders/$ORDER_ID"
echo

echo
echo "11) Update Order"
curl -s -X PUT -H "Content-Type: application/json" \
  -d "{\"products\":[\"$PRODUCT_ID_2\"]}" \
  "$API/orders/$ORDER_ID"
echo

echo
echo "12) Delete Order"
curl -s -X DELETE "$API/orders/$ORDER_ID"
echo

echo
echo "13) Direct Order (Customer must exist)"
RESPONSE_DIRECT=$(curl -s -X POST -H "Content-Type: application/json" \
  -d "{\"products\":[\"$PRODUCT_ID_2\"]}" \
  "$API/orders/direct/$CUSTOMER_ID")
echo "Response: $RESPONSE_DIRECT"

echo
echo "=== Bonus Tests ==="

echo
echo "14) Create Multiple Products for Pagination/Search (Minecraft Items)"
ITEMS=("Iron Ore" "Gold Ore" "Coal" "Emerald" "Netherite")
i=1
for item in "${ITEMS[@]}"; do
  curl -s -X POST -H "Content-Type: application/json" \
    -d "{\"name\":\"$item\",\"description\":\"Block #$i\",\"price\":$((i*10)),\"stock\":$((i*5))}" \
    "$API/products" > /dev/null
  ((i++))
done
echo "5 products created."

echo
echo "15) Search products with 'Ore'"
curl -s -X GET "$API/products?search=Ore"
echo

echo
echo "16) Pagination: page=2, limit=2"
curl -s -X GET "$API/products?page=2&limit=2"
echo

echo "=== TEST COMPLETE ==="
