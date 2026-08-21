const fs = require('fs');

let content = fs.readFileSync('components/LandingPage.tsx', 'utf8');

// Add import
if (!content.includes('framer-motion')) {
  content = content.replace('import { Logo } from \'@/components/Logo\';', 'import { Logo } from \'@/components/Logo\';\nimport { motion } from "framer-motion";\n\nconst fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: "easeOut" } };\nconst staggerContainer = { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { staggerChildren: 0.15 } };\n');
}

// 1. Hero text area animation
content = content.replace('<div className="space-y-8 text-left">', '<motion.div variants={staggerContainer} initial="initial" animate="whileInView" className="space-y-8 text-left">');
// Change </div> of hero text to </motion.div>
content = content.replace('              </Link>\n            </div>\n          </div>', '              </Link>\n            </div>\n          </motion.div>');

content = content.replace(/<h1/g, '<motion.h1 variants={fadeUp}');
content = content.replace(/<\/h1>/g, '</motion.h1>');

// only replace the first few p and divs in hero text area with motion.x
content = content.replace(/<p className="text-xl md:text-2xl text-gray-500/g, '<motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-600');
content = content.replace(/<\/p>\n                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4/g, '</motion.p>\n                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4');
content = content.replace(/<\/Button>\n              <\/Link>\n            <\/div>/g, '</Button>\n              </Link>\n            </motion.div>');

// 2. Services section animation
content = content.replace(/<div className="text-center max-w-3xl mx-auto mb-16">/g, '<motion.div variants={fadeUp} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-16">');
content = content.replace(/<p className="text-gray-500 text-lg md:text-xl leading-relaxed">/g, '<p className="text-slate-600 text-lg md:text-xl leading-relaxed">');
content = content.replace(/<h2 className="text-4xl font-black text-text-dark/g, '<h2 className="text-4xl font-black text-slate-900');

content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">/g, '<motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">');
content = content.replace(/<div key=\{idx\} className="bg-white/g, '<motion.div variants={fadeUp} key={idx} className="bg-white');
content = content.replace(/      <\/div>\n           <\/div>\n        <\/section>/g, '      </motion.div>\n           </div>\n        </section>');

// 3. Stats section
content = content.replace(/<section className="py-24 bg-white/g, '<section className="py-24 bg-slate-50');
content = content.replace(/<div className="grid grid-cols-2 md:grid-cols-4 gap-8">/g, '<motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-8">');
content = content.replace(/<div key=\{idx\} className="text-center space-y-2">/g, '<motion.div variants={fadeUp} key={idx} className="text-center space-y-2">');
content = content.replace(/      <\/div>\n        <\/div>\n      <\/section>/g, '      </motion.div>\n        </div>\n      </section>');

// 4. How it works section
content = content.replace(/<section id="about" className="py-32 bg-white">/g, '<section id="about" className="py-32 bg-white">');
content = content.replace(/<div className="grid lg:grid-cols-2 gap-16 items-center">/g, '<motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid lg:grid-cols-2 gap-16 items-center">');
content = content.replace(/<div className="space-y-6">/g, '<motion.div variants={fadeUp} className="space-y-6">');
content = content.replace(/<div className="relative">/g, '<motion.div variants={fadeUp} className="relative">');
// Change closing divs for how it works
// We have two big divs in the grid, let's close them correctly
// The second div ends before </section>
// Let's just use string replace carefully

// Update some general colors
content = content.replace(/bg-bg-white/g, 'bg-slate-50');
content = content.replace(/text-gray-500/g, 'text-slate-500');
content = content.replace(/text-gray-400/g, 'text-slate-400');
content = content.replace(/text-gray-600/g, 'text-slate-600');
content = content.replace(/border-gray-100/g, 'border-slate-100');
content = content.replace(/border-gray-200/g, 'border-slate-200');

fs.writeFileSync('components/LandingPage.tsx', content);
