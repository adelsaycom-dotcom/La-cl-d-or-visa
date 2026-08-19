import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Fix firestore import
content = content.replace(
    "import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';",
    "import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction, writeBatch, query, where, getDocs } from 'firebase/firestore';"
)

# Fix Transaction interface
old_tx = r"""export interface Transaction \{
  id: string;
  agencyId: string;
  type: string;
  amount: number;
  date: string;
  ref: string;
  note: string;
  createdAt: string;
\}"""

new_tx = """export interface Transaction {
  id: string;
  agencyId: string;
  agencyName?: string;
  type: string;
  amount: number;
  date: string;
  ref?: string;
  note?: string;
  description?: string;
  status?: string;
  createdAt: string;
}"""

content = re.sub(old_tx, new_tx, content)

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
