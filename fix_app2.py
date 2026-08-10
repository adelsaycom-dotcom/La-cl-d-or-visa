content = open('src/App.tsx').read()
if 'import { useLocation }' not in content:
    content = content.replace('import { BrowserRouter as Router, Routes, Route, Outlet, Link } from "react-router-dom";', 'import { BrowserRouter as Router, Routes, Route, Outlet, Link, useLocation } from "react-router-dom";')
    content = content.replace('import { Link, Outlet, Router, Routes, Route } from "react-router-dom";', 'import { Link, Outlet, Router, Routes, Route, useLocation } from "react-router-dom";')
    if 'import { motion, AnimatePresence } from "framer-motion";' not in content:
        content = 'import { motion, AnimatePresence } from "framer-motion";\n' + content
open('src/App.tsx', 'w').write(content)
