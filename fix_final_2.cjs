const fs = require('fs');
let content = fs.readFileSync('components/agency/OrganizedTrips.tsx', 'utf8');

// There is one extra `</div>` before `</ScrollArea>`. Let's remove it.
content = content.replace(
  '                        </div>\n\n                    </div>\n                  </ScrollArea>',
  '                        </div>\n                  </ScrollArea>'
);

fs.writeFileSync('components/agency/OrganizedTrips.tsx', content);
