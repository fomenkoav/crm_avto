import django_filters
from .models import Client

class ClientFilter(django_filters.FilterSet):
    phone = django_filters.CharFilter(lookup_expr='icontains')
    license_type = django_filters.CharFilter(field_name='license_type')

    class Meta:
        model = Client
        fields = ['phone', 'email', 'license_type', 'is_active']