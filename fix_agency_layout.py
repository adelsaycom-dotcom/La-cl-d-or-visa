import re

content = open('components/agency/AgencyLayout.tsx').read()
content = content.replace('import { useState } from "react";', 'import { useState } from "react";\nimport { useLocation } from "react-router-dom";\nimport { motion, AnimatePresence } from "framer-motion";')
content = content.replace('<Outlet />', '<AnimatePresence mode="wait">\n          <motion.div\n            key={useLocation().pathname}\n            initial={{ opacity: 0, y: 10 }}\n            animate={{ opacity: 1, y: 0 }}\n            exit={{ opacity: 0, y: -10 }}\n            transition={{ duration: 0.2 }}\n          >\n            <Outlet />\n          </motion.div>\n        </AnimatePresence>')
open('components/agency/AgencyLayout.tsx', 'w').write(content)
