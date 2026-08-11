import re

content = open('components/agency/AgencySupport.tsx').read()
content = content.replace(
    'onClick={() => setIsNewTicketOpen(false)}>Soumettre le ticket</Button>',
    'onClick={handleSubmit}>Soumettre le ticket</Button>'
)
open('components/agency/AgencySupport.tsx', 'w').write(content)
