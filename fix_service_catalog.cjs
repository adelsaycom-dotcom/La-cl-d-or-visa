const fs = require('fs');

let content = fs.readFileSync('components/admin/ServiceCatalog.tsx', 'utf8');

content = content.replace(
  '<ScrollArea className="flex-1 overflow-y-auto">',
  '<div className="flex-1 overflow-y-auto min-h-0">'
);
content = content.replace(
  '</ScrollArea>\n         </DialogContent>',
  '</div>\n         </DialogContent>'
);

fs.writeFileSync('components/admin/ServiceCatalog.tsx', content);
