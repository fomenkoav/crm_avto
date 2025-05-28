from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Driver(models.Model):
    LICENSE_TYPES = [
        ('B', 'Легкові авто'),
        ('C', 'Вантажівки'),
        ('D', 'Автобуси'),
    ]

    name = models.CharField(max_length=100, verbose_name="ПІБ водія")
    license_number = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Номер посвідчення"
    )
    license_type = models.CharField(
        max_length=1,
        choices=LICENSE_TYPES,
        verbose_name="Категорія прав"
    )
    phone = models.CharField(max_length=20, verbose_name="Телефон")
    experience = models.PositiveIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(70)],
        verbose_name="Стаж (роки)"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активний")
    is_available = models.BooleanField(default=True)
    hire_date = models.DateField(verbose_name="Дата найму")
    birth_date = models.DateField(verbose_name="Дата народження")

    class Meta:
        verbose_name = "Водій"
        verbose_name_plural = "Водії"
        ordering = ['name']
        indexes = [
            models.Index(fields=['license_number']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.license_number})"