from rest_framework import serializers
from .models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    vehicle_type_display = serializers.CharField(
        source='get_vehicle_type_display',
        read_only=True
    )
    fuel_type_display = serializers.CharField(
        source='get_fuel_type_display',
        read_only=True
    )

    class Meta:
        model = Vehicle
        fields = [
            'id',
            'make',
            'model',
            'license_plate',
            'vehicle_type',
            'vehicle_type_display',
            'year',
            'fuel_type',
            'fuel_type_display',
            'mileage',
            'is_available',
            'last_maintenance'
        ]

class VehicleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = [
            'make',
            'model',
            'license_plate',
            'vehicle_type',
            'year',
            'fuel_type',
            'purchase_date',
            'purchase_price'
        ]
        extra_kwargs = {
            'license_plate': {'required': True},
            'vehicle_type': {'required': True},
            'capacity': {'required': True}
        }

class VehicleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class VehicleStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['is_available']