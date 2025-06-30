import sympy as sp
import os

show_help_option = input("Type 0 to view HELP or press ENTER to continue: ")
if show_help_option.strip() == '0':
    def show_help():
        print("\n=== 📘 HILL CIPHER MOD 97 PROGRAM HELP ===\n")
        print("This program encrypts and decrypts text or .txt files using the Hill Cipher algorithm.")
        print("Supported characters are printable ASCII (space to ~) plus two extra: '§' and '¤'.")
        print("Operations are performed using an nxn key matrix and modulo 97 arithmetic.\n")

        print("🔢 Main Features:")
        print("- Option to encrypt or decrypt text directly from input")
        print("- Option to encrypt or decrypt a .txt file via upload")
        print("- Automatically generates an invertible key matrix modulo 97")
        print("- Displays the key matrix and its inverse")
        print("- Provides download buttons for encryption/decryption results (for file mode)\n")

        print("✅ Usage Steps:")
        print("1. Run all cells in Google Colab")
        print("2. Enter '0' to see this help menu")
        print("3. Choose '1' for direct text or '2' for .txt file")
        print("4. Select key matrix size from 2 to 7")
        print("5. If using a .txt file, upload it when prompted")
        print("6. The encrypted and decrypted results will be shown and can be downloaded (if file mode)\n")

        print("🔐 Notes:")
        print("- Do not use characters outside ASCII 32–126 + ['§', '¤']")
        print("- Automatic padding uses '§' to complete matrix blocks")
        print("==============================================\n")

    show_help()

# CHARSET: printable ASCII (32–126) + 2 additional → total 97 characters
CHARSET = [chr(i) for i in range(32, 127)] + ['§', '¤']
CHARSET_SIZE = len(CHARSET)  # = 97
MODULUS = 97  # matches character count

# Character <-> Number mapping
char_to_num = {c: i for i, c in enumerate(CHARSET)}
num_to_char = {i: c for i, c in enumerate(CHARSET)}

def clean_text(text):
    return ''.join(c for c in text if c in CHARSET)

def pad_text(text, block_size):
    padding = (-len(text)) % block_size
    return text + '§' * padding  # padding character is guaranteed in CHARSET

def encrypt(text, key, modulus):
    size = key.shape[0]
    text = pad_text(clean_text(text), size)
    nums = [char_to_num[c] for c in text]
    blocks = [nums[i:i+size] for i in range(0, len(nums), size)]

    cipher_nums = []
    for block in blocks:
        vec = sp.Matrix(block)
        res = key * vec % modulus
        cipher_nums.extend(res)

    return ''.join(num_to_char[int(n)] for n in cipher_nums)

def decrypt(cipher, key, modulus):
    size = key.shape[0]
    nums = [char_to_num[c] for c in cipher]
    blocks = [nums[i:i+size] for i in range(0, len(nums), size)]

    inv_key = key.inv_mod(modulus)
    plain_nums = []
    for block in blocks:
        vec = sp.Matrix(block)
        res = inv_key * vec % modulus
        plain_nums.extend(res)

    return ''.join(num_to_char[int(n)] for n in plain_nums).rstrip('§')

def generate_valid_key(size, modulus):
    for _ in range(1000):
        candidate = sp.Matrix(sp.randMatrix(size, size, min=0, max=modulus - 1))
        try:
            _ = candidate.inv_mod(modulus)
            return candidate
        except:
            continue
    raise ValueError(f"Failed to find a {size}×{size} matrix that is invertible modulo {modulus}")

# === Choose Mode ===
print("Select mode:")
print("1. Encrypt/Decrypt Text")
print("2. Encrypt/Decrypt .txt File")

mode = input("Enter your choice (1/2): ").strip()
available_n = [2, 3, 4, 5, 6, 7]

while True:
    try:
        n = int(input("Choose key matrix size n x n (2–7): "))
        if n in available_n:
            break
        else:
            print("Size not available.")
    except:
        print("Please enter a valid number.")

# Generate key matrix
key = generate_valid_key(n, MODULUS)
key_inv = key.inv_mod(MODULUS)

print("\n🔐 Key Matrix:")
sp.pprint(key)

print("\n♻️ Inverse Key Matrix modulo 97:")
sp.pprint(key_inv)

# === Direct Text Mode ===
if mode == '1':
    plaintext = input("\nEnter your text message: ")
    ciphertext = encrypt(plaintext, key, MODULUS)
    decrypted = decrypt(ciphertext, key, MODULUS)

    print("\n📝 Original Message:")
    print(plaintext)

    print("\n🔒 Ciphertext:")
    print(ciphertext)

    print("\n🔓 Decrypted Text:")
    print(decrypted)

# === .txt File Mode ===
elif mode == '2':
    print("\n📤 Enter the path to your .txt file:")
    file_path = input("File path: ").strip()
    
    # Remove quotes if present
    if (file_path.startswith('"') and file_path.endswith('"')) or \
       (file_path.startswith("'") and file_path.endswith("'")):
        file_path = file_path[1:-1]
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
        
        filename = os.path.basename(file_path)
        text = clean_text(text)

        print(f"\n📄 Original file content ({filename}):\n{text}")

        ciphertext = encrypt(text, key, MODULUS)
        decrypted = decrypt(ciphertext, key, MODULUS)

        print("\n🔒 Ciphertext:")
        print(ciphertext)

        print("\n🔓 Decrypted Text:")
        print(decrypted)

        # Save results
        encrypted_filename = f"encrypted_{filename}"
        decrypted_filename = f"decrypted_{filename}"

        with open(encrypted_filename, 'w', encoding='utf-8') as f:
            f.write(ciphertext)

        with open(decrypted_filename, 'w', encoding='utf-8') as f:
            f.write(decrypted)

        print(f"\n✅ Ciphertext saved to: {encrypted_filename}")
        print(f"✅ Decrypted text saved to: {decrypted_filename}")
        
        print(f"\nFiles saved in: {os.getcwd()}")
        
    except FileNotFoundError:
        print(f"❌ File not found: {file_path}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

else:
    print("❌ Invalid mode selected.")