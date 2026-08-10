import re

def clear_mock(file_path, var_name):
    content = open(file_path).read()
    # Find the variable definition and its array
    pattern = r'const ' + var_name + r'\s*=\s*\[.*?\];'
    content = re.sub(pattern, f'const {var_name}: any[] = [];', content, flags=re.DOTALL)
    open(file_path, 'w').write(content)

clear_mock('components/admin/AgencyManagement.tsx', 'MOCK_AGENCIES')
clear_mock('components/admin/SupportManagement.tsx', 'MOCK_TICKETS')
clear_mock('components/agency/AgencySupport.tsx', 'MOCK_TICKETS')

