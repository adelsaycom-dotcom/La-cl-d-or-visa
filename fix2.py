content = open("components/agency/VisaWizard.tsx").read()
import re
content = re.sub(r'</label>\s*</>\s*</div>\s*</div>\s*</>\s*}\)', '</label>\n                    </>\n                  )}', content)
content = re.sub(r'/>\s*<>\s*<label className', '/>\n                        </label>\n                      ),\n                    )\n                  ) : (\n                    <>\n                      <label className', content)
open("components/agency/VisaWizard.tsx", "w").write(content)
