# Generated by Django 5.1.2 on 2024-11-30 00:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_remove_flashcard_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notes',
            name='code',
        ),
    ]
