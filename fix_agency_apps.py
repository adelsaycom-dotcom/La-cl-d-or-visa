import re

with open('components/agency/AgencyApplications.tsx', 'r') as f:
    content = f.read()

content = content.replace('Approuvé', 'Terminé')
content = content.replace('En révision', 'En cours de traitement')
content = content.replace('Le visa est prêt !', 'Le document est prêt !')
content = content.replace("Cette demande a été rejetée par l'administration.", "Cette demande a été rejetée par nos services. Veuillez nous contacter pour plus de détails.")

with open('components/agency/AgencyApplications.tsx', 'w') as f:
    f.write(content)
