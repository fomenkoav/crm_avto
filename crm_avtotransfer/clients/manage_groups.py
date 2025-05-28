# scripts/manage_groups.py
import os
import django

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transfCRM.settings')
django.setup()

from django.contrib.auth.models import Group
from users.models import User

# --- Налаштування ---
USERNAME = "testuser"
TARGET_ROLE = "manager"  # Вказати роль: 'administrator', 'manager', 'driver', 'user'

# --- Отримати або створити користувача ---
user, created = User.objects.get_or_create(username=USERNAME, defaults={"password": "testpass", "role": TARGET_ROLE})
if created:
    user.set_password("testpass")
    user.save()
    print(f"Created new user: {USERNAME}")
else:
    print(f"User {USERNAME} already exists")

# --- Створити групи, якщо не існують ---
group_names = ["administrator", "manager", "driver", "user"]
for group_name in group_names:
    Group.objects.get_or_create(name=group_name)

# --- Призначити користувача до цільової групи ---
# Спочатку видалимо з усіх груп
user.groups.clear()

# Додати до нової групи
target_group = Group.objects.get(name=TARGET_ROLE)
user.groups.add(target_group)
print(f"Added user '{USERNAME}' to group '{TARGET_ROLE}'")

# --- Вивести групи користувача ---
print(f"User '{USERNAME}' groups:", list(user.groups.values_list("name", flat=True)))