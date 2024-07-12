from django.db import migrations

def delete_orphaned_transactions(apps, schema_editor):
    Transaction = apps.get_model('Users', 'Transaction')
    CustomUser = apps.get_model('Users', 'CustomUser')

    # Delete transactions with no corresponding user
    orphaned_transactions = Transaction.objects.filter(user__isnull=True)
    orphaned_transactions.delete()

class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0004_customuser_email_verified'),  # Ensure this matches the actual last migration file in Users app
    ]

    operations = [
        migrations.RunPython(delete_orphaned_transactions),
    ]
