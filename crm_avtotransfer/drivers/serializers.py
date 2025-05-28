from rest_framework import serializers
from .models import Driver

class DriverSerializer(serializers.ModelSerializer):
    license_type_display = serializers.CharField(
        source='get_license_type_display',
        read_only=True
    )

    class Meta:
        model = Driver
        fields = [
            'id',
            'name',
            'license_number',
            'license_type',
            'license_type_display',
            'phone',
            'experience',
            'is_active',
            'is_available',
            'hire_date'
        ]

class DriverCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = [
            'name',
            'license_number',
            'license_type',
            'phone',
            'experience',
            'birth_date'
        ]
        extra_kwargs = {
            'license_number': {'required': True},
            'license_type': {'required': True}
        }

class DriverDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class DriverStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['is_active', 'is_available']