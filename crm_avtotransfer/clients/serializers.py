from rest_framework import serializers
from .models import Client
from rest_framework.validators import UniqueValidator
import re

class ClientSerializer(serializers.ModelSerializer):
    license_type_display = serializers.CharField(
        source='get_license_type_display',
        read_only=True
    )

    class Meta:
        model = Client
        fields = [
            'id',
            'name',
            'phone',
            'email',
            'license_type',
            'license_type_display',
            'license_number',
            'is_active',
            'registration_date'
        ]

class ClientCreateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(
        validators=[UniqueValidator(queryset=Client.objects.all())]
    )
    email = serializers.EmailField(
        required=False,
        validators=[UniqueValidator(queryset=Client.objects.all())]
    )

    class Meta:
        model = Client
        fields = [
            'name',
            'phone',
            'email',
            'license_type',
            'license_number'
        ]
        extra_kwargs = {
            'phone': {'required': True},
            'license_number': {'required': True}
        }

    def validate_phone(self, value):
        phone_regex = re.compile(r'^\+?1?\d{9,15}$')
        if not phone_regex.match(value):
            raise serializers.ValidationError("Invalid phone number format. Use +999999999, up to 15 digits.")
        return value

class ClientDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ClientLicenseUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['license_type', 'license_number']
        extra_kwargs = {
            'license_type': {'required': True},
            'license_number': {'required': True}
        }