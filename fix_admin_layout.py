import re

content = open('src/App.tsx').read()
if 'key={useLocation().pathname}' not in content.split('AdminLayout')[1]:
    # We need to wrap Outlet inside AdminLayout
    # But wait, AdminLayout is in App.tsx!
    # Let's find the <Outlet /> inside AdminLayout.
    # It's at the end of the return statement of AdminLayout.
    
    # Actually I already did this replacement! Let me check where the Outlet is.
    pass

