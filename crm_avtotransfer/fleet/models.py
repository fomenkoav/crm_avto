from django.db import models
from django.core.validators import MinValueValidator


class Vehicle(models.Model):
    VEHICLE_TYPES = [
        ('sedan', 'Седан'),
        ('minivan', 'Мінівен'),
        ('suv', 'Позашляховик'),
        ('bus', 'Автобус'),
    ]

    FUEL_TYPES = [
        ('petrol', 'Бензин'),
        ('diesel', 'Дизель'),
        ('electric', 'Електро'),
        ('hybrid', 'Гібрид'),
    ]

    make = models.CharField(max_length=50, verbose_name="Марка")
    model = models.CharField(max_length=50, verbose_name="Модель")
    year = models.PositiveIntegerField(
        validators=[MinValueValidator(2000)],
        verbose_name="Рік випуску"
    )
    license_plate = models.CharField(
        max_length=15,
        unique=True,
        verbose_name="Держномер"
    )
    vehicle_type = models.CharField(
        max_length=10,
        choices=VEHICLE_TYPES,
        verbose_name="Тип транспорту"
    )
    capacity = models.PositiveIntegerField(verbose_name="Кількість місць")
    fuel_type = models.CharField(
        max_length=10,
        choices=FUEL_TYPES,
        verbose_name="Тип палива"
    )
    mileage = models.PositiveIntegerField(
        default=0,
        verbose_name="Пробіг (км)"
    )
    last_maintenance = models.DateField(
        null=True,
        blank=True,
        verbose_name="Дата останнього ТО"
    )
    is_available = models.BooleanField(
        default=True,
        verbose_name="Доступний"
    )
    purchase_date = models.DateField(verbose_name="Дата покупки")
    purchase_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Вартість покупки"
    )
    capacity = models.IntegerField(
        verbose_name="Місткість",
        default=4,
        help_text="Кількість пасажирів"
    )

    class Meta:
        verbose_name = "Транспортний засіб"
        verbose_name_plural = "Транспортні засоби"
        ordering = ['-purchase_date']
        indexes = [
            models.Index(fields=['license_plate']),
            models.Index(fields=['is_available']),
            models.Index(fields=['vehicle_type']),
        ]

    def __str__(self):
        return f"{self.make} {self.model} ({self.license_plate})"

