# Generated by Django 5.1.2 on 2024-11-30 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0010_remove_notes_code'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='quiz',
            name='code',
        ),
        migrations.AlterField(
            model_name='subject',
            name='code',
            field=models.CharField(default='DEFAULT', max_length=10),
        ),
    ]