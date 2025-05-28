from rest_framework import serializers
from clients.models import Client
from clients.serializers import ClientSerializer
from drivers.models import Driver
from drivers.serializers import DriverSerializer
from fleet.models import Vehicle
from fleet.serializers import VehicleSerializer
from .models import Order

class OrderCreateSerializer(serializers.ModelSerializer):
    """Серіалізатор для створення замовлень (без деталей зв'язаних об'єктів)"""
    class Meta:
        model = Order
        fields = [
            'id',
            'client',
            'driver',
            'vehicle',
            'pickup_address',
            'destination',
            'status',
            'payment_type',
            'price',
            'notes'
        ]
        extra_kwargs = {
            'status': {'read_only': True},  # Статус автоматично встановлюється
            'client': {'required': True},
            'pickup_address': {'required': True},
            'destination': {'required': True}
        }

    def validate(self, data):
        """Кастомна валідація для замовлення"""
        if data['pickup_address'] == data['destination']:
            raise serializers.ValidationError(
                "Адреса подачі та призначення повинні відрізнятися"
            )
        return data

class OrderListSerializer(serializers.ModelSerializer):
    """Серіалізатор для списку замовлень (з основними даними клієнта/водія)"""
    client = serializers.StringRelatedField()
    driver = serializers.StringRelatedField()
    vehicle = serializers.StringRelatedField()
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Order
        fields = [
            'id',
            'client',
            'driver',
            'vehicle',
            'pickup_address',
            'destination',
            'status',
            'status_display',
            'price',
            'created_at'
        ]

class OrderDetailSerializer(serializers.ModelSerializer):
    """Серіалізатор для детального перегляду (з повними даними зв'язаних моделей)"""
    client = ClientSerializer(read_only=True)
    driver = DriverSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)
    payment_type_display = serializers.CharField(
        source='get_payment_type_display',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Серіалізатор для оновлення статусу"""
    class Meta:
        model = Order
        fields = ['status']
        extra_kwargs = {
            'status': {'required': True}
        }

    def validate_status(self, value):
        """Валідація статусу"""
        valid_transitions = {
            'new': ['confirmed', 'cancelled'],
            'confirmed': ['in_progress', 'cancelled'],
            'in_progress': ['completed'],
            'completed': [],
            'cancelled': []
        }

        current_status = self.instance.status
        if value not in valid_transitions[current_status]:
            raise serializers.ValidationError(
                f"Недопустимий перехід статусу з {current_status} на {value}"
            )
        return value