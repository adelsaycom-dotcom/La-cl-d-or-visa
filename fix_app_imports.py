import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace('import { useState, lazy, Suspense } from "react";', 'import { useState, useEffect, lazy, Suspense } from "react";\nimport { useAppStore } from "./store/useAppStore";')

with open('src/App.tsx', 'w') as f:
    f.write(content)
