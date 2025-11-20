# BuenoToken Guide - Working with 2 Decimals

## 🎯 Understanding Token Decimals

Your BuenoToken uses **2 decimals**, unlike most ERC20 tokens which use 18 decimals (like ETH or CELO).

```solidity
function decimals() public pure override returns (uint8) {
    return 2;
} 
```

### What This Means

- **Standard tokens (18 decimals)**: 1 token = 1,000,000,000,000,000,000 (1e18) smallest units
- **BuenoToken (2 decimals)**: 1 token = 100 smallest units

## 🔧 Frontend Usage

### Reading Token Balances

**❌ Wrong (uses 18 decimals):**
```typescript
import { formatEther } from "viem";

// If raw balance is 12345
const balance = formatEther(balance); // Returns "0.000000000000012345" ❌
```

**✅ Correct (uses 2 decimals):**
```typescript
import { formatUnits } from "viem";

// If raw balance is 12345
const balance = formatUnits(balance, 2); // Returns "123.45" ✅
```

### Sending Tokens

**❌ Wrong (uses 18 decimals):**
```typescript
import { parseEther } from "viem";

// Trying to send 1 token
const amount = parseEther("1"); // Returns 1000000000000000000 (way too much!) ❌
```

**✅ Correct (uses 2 decimals):**
```typescript
import { parseUnits } from "viem";

// Sending 1 token
const amount = parseUnits("1", 2); // Returns 100 ✅

// Sending 123.45 tokens
const amount = parseUnits("123.45", 2); // Returns 12345 ✅
```

## 🏗️ Remix Examples

### Minting Tokens in Remix

When using the `mint` function in Remix, remember to use the raw amount (with 2 decimals):

**Examples:**

| Tokens to Mint | Raw Amount (with 2 decimals) |
|---------------|------------------------------|
| 1 token       | `100`                        |
| 10 tokens     | `1000`                       |
| 100 tokens    | `10000`                      |
| 1000 tokens   | `100000`                     |
| 1.50 tokens   | `150`                        |
| 0.01 token    | `1`                          |

**Remix Steps:**

1. In Remix, find your deployed BuenoToken under "Deployed Contracts"
2. Expand the `mint` function
3. Enter parameters:
   - `to`: Recipient address (e.g., `0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0`)
   - `amount`: Raw amount with 2 decimals (e.g., `100000` for 1000 tokens)
4. Click "transact"
5. Confirm in MetaMask

### Example: Minting 1000 Tokens

```
Function: mint
Parameters:
- to: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0
- amount: 100000

This will mint 1000.00 BTK tokens
```

## 💻 Code Examples

### Complete TokenBalance Component

```typescript
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";

const { data: balance } = useReadContract({
  address: CONTRACT_ADDRESS,
  abi: TOKEN_ABI,
  functionName: "balanceOf",
  args: [userAddress],
});

// Display with 2 decimals
const displayBalance = balance 
  ? parseFloat(formatUnits(balance as bigint, 2)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  : "0.00";
```

### Complete Transfer Function

```typescript
import { parseUnits } from "viem";
import { useWriteContract } from "wagmi";

const { writeContract } = useWriteContract();

const handleTransfer = async (recipient: string, amount: string) => {
  // Convert amount from user input to raw units with 2 decimals
  const rawAmount = parseUnits(amount, 2);
  
  writeContract({
    address: CONTRACT_ADDRESS,
    abi: TOKEN_ABI,
    functionName: "transfer",
    args: [recipient, rawAmount],
  });
};

// Example usage:
// User enters "10.50" → parseUnits("10.50", 2) → 1050 raw units
```

### Handling User Input

```typescript
const [amount, setAmount] = useState("");

const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  
  // Allow only numbers and one decimal point
  if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
    setAmount(value);
  }
};

return (
  <input
    type="text"
    value={amount}
    onChange={handleAmountChange}
    placeholder="0.00"
    step="0.01"
    min="0"
  />
);
```

## 🧮 Quick Reference

### Conversion Table

| Display Value | Raw Value (2 decimals) | Hex Value |
|--------------|------------------------|-----------|
| 0.01         | 1                      | 0x1       |
| 0.10         | 10                     | 0xa       |
| 1.00         | 100                    | 0x64      |
| 10.00        | 1000                   | 0x3e8     |
| 100.00       | 10000                  | 0x2710    |
| 1000.00      | 100000                 | 0x186a0   |

### JavaScript Conversion Functions

```javascript
// Convert display value to raw value
function toRaw(displayValue) {
  return Math.floor(parseFloat(displayValue) * 100);
}

// Convert raw value to display value
function toDisplay(rawValue) {
  return (parseInt(rawValue) / 100).toFixed(2);
}

// Examples:
toRaw("123.45");   // Returns: 12345
toDisplay("12345"); // Returns: "123.45"
```

## 🐛 Common Issues

### Issue: Balance shows as 0.0000...001

**Problem:** Using `formatEther` (18 decimals) instead of `formatUnits` with 2 decimals.

**Solution:**
```typescript
// ❌ Wrong
formatEther(balance)

// ✅ Correct
formatUnits(balance, 2)
```

### Issue: "Execution reverted" when transferring

**Problem:** Using `parseEther` (18 decimals) which creates amounts way larger than your balance.

**Solution:**
```typescript
// ❌ Wrong
parseEther("1")  // Creates 1000000000000000000

// ✅ Correct
parseUnits("1", 2)  // Creates 100
```

### Issue: Transfer amount too small

**Problem:** The minimum transfer amount is 0.01 tokens (1 raw unit).

**Solution:** Ensure amounts are at least 0.01:
```typescript
if (parseFloat(amount) < 0.01) {
  alert("Minimum transfer amount is 0.01 tokens");
  return;
}
```

## 🎨 UI Best Practices

### Input Validation

```typescript
// Validate input has at most 2 decimal places
const isValid = (value: string) => {
  return /^\d+(\.\d{0,2})?$/.test(value);
};

// Format display values consistently
const formatDisplay = (value: bigint) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(formatUnits(value, 2)));
};
```

### Error Messages

```typescript
const getErrorMessage = (error: Error) => {
  if (error.message.includes("insufficient")) {
    return "Insufficient token balance";
  }
  if (error.message.includes("invalid amount")) {
    return "Please enter a valid amount (e.g., 10.50)";
  }
  return "Transaction failed. Please try again.";
};
```

## 📝 Testing Checklist

- [ ] Balance displays correctly (e.g., "123.45" not "0.00000123")
- [ ] Can send 1 token successfully
- [ ] Can send 0.01 token (minimum amount)
- [ ] Can send fractional amounts (e.g., 10.50)
- [ ] Balance updates after successful transfer
- [ ] Error handling works for insufficient balance
- [ ] Decimals are consistent throughout UI

## 🚀 Next Steps

1. Update all token amount handling to use `formatUnits(amount, 2)` for reading
2. Update all token transfers to use `parseUnits(amount, 2)` for writing
3. Test minting tokens in Remix with correct decimal amounts
4. Verify frontend displays balances correctly
5. Test transfers with various amounts

Happy building! 🎉

