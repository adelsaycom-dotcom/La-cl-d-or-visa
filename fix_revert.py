import re

files = [
    'components/admin/ApplicationManagement.tsx',
    'components/agency/AgencyApplications.tsx',
    'components/admin/OrganizedTripsManagement.tsx'
]

for file_path in files:
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        # We want to match {typeof <var> === 'object' ? JSON.stringify(<var>) : String(<var> || '')}
        # and replace with {<var>}
        pattern = r"\{typeof ([a-zA-Z0-9_\.]+) === 'object' \? JSON\.stringify\(\1\) : String\(\1 \|\| ''\)\}"
        new_content = re.sub(pattern, r'{\1}', content)
        
        with open(file_path, 'w') as f:
            f.write(new_content)
        print(f"Fixed {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
