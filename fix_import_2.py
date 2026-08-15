import os

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

content = content.replace("import { collection, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';", "import { collection, doc, setDoc, updateDoc, deleteDoc, runTransaction } from 'firebase/firestore';")

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
