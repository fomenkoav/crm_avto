from django.db import models
from django.core.validators import EmailValidator, RegexValidator


class Client(models.Model):
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Номер телефону має бути у форматі: '+380123456789'"
    )
    LICENSE_TYPES = [
        ('Passport', 'Паспорт'),
        ('Driver license', 'Посвідчення водія'),
        ('Car license', 'Паспорт на авто'),
    ]

    name = models.CharField(
        max_length=100,
        verbose_name="Ім'я клієнта"
    )
    phone = models.CharField(
        max_length=17,
        validators=[phone_regex],
        verbose_name="Телефон",
        unique=True
    )
    email = models.EmailField(
        validators=[EmailValidator()],
        verbose_name="Email",
        blank=True,
        null=True
    )
    preferences = models.JSONField(
        verbose_name="Переваги",
        default=dict,
        blank=True
    )
    registration_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата реєстрації"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Активний клієнт"
    )
    license_number = models.CharField(
        max_length=100,
        verbose_name="Дані документа"
    )

    license_type = models.CharField(
        max_length=100,
        choices=LICENSE_TYPES,
        verbose_name="Підтверджуючий документ"
    )

    class Meta:
        verbose_name = "Клієнт"
        verbose_name_plural = "Клієнти"
        ordering = ['-registration_date']
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['email']),
        ]

    def __str__(self):
        return f"{self.name} ({self.phone})"
