import re

with open('src/store/useAppStore.ts', 'r') as f:
    content = f.read()

# Add Notification interface
if 'export interface Notification' not in content:
    notif_interface = """export interface Notification {
  id: string;
  agencyId: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface SupportTicket {"""
    content = content.replace("export interface SupportTicket {", notif_interface)

if 'notifications: Notification[];' not in content:
    content = content.replace("agencies: Agency[];", "agencies: Agency[];\n  notifications: Notification[];\n  markNotificationAsRead: (id: string) => void;\n  markAllNotificationsAsRead: (agencyId: string) => void;")

if 'notifications: [],' not in content:
    content = content.replace("agencies: [],", "agencies: [],\n  notifications: [],")

with open('src/store/useAppStore.ts', 'w') as f:
    f.write(content)
