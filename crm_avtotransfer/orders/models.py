from django.db import models
from clients.models import Client
from drivers.models import Driver
from fleet.models import Vehicle


class Order(models.Model):
    STATUS_CHOICES = [
        ('new', 'Нове'),
        ('confirmed', 'Підтверджене'),
        ('in_progress', 'Виконується'),
        ('completed', 'Завершене'),
        ('cancelled', 'Скасоване'),
    ]

    PAYMENT_TYPES = [
        ('cash', 'Готівка'),
        ('card', 'Картка'),
        ('invoice', 'Рахунок'),
    ]

    client = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name="Клієнт"
    )
    driver = models.ForeignKey(
        'drivers.Driver',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Водій"
    )
    vehicle = models.ForeignKey(
        'fleet.Vehicle',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders',
        verbose_name="Транспорт"
    )
    pickup_address = models.TextField(verbose_name="Адреса подачі")
    destination = models.TextField(verbose_name="Адреса призначення")
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='new',
        verbose_name="Статус"
    )
    payment_type = models.CharField(
        max_length=10,
        choices=PAYMENT_TYPES,
        default='cash',
        verbose_name="Тип оплати"
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Вартість"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата створення"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Дата оновлення"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Додаткові нотатки"
    )

    class Meta:
        verbose_name = "Замовлення"
        verbose_name_plural = "Замовлення"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['client', 'status']),
        ]

    def __str__(self):
        return f"Замовлення #{self.id} - {self.client.name} ({self.get_status_display()})"
