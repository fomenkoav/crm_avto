import django_filters
from .models import Vehicle

class VehicleFilter(django_filters.FilterSet):
    min_year = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='gte'
    )
    max_year = django_filters.NumberFilter(
        field_name='year',
        lookup_expr='lte'
    )
    min_mileage = django_filters.NumberFilter(
        field_name='mileage',
        lookup_expr='gte'
    )
    max_mileage = django_filters.NumberFilter(
        field_name='mileage',
        lookup_expr='lte'
    )

    class Meta:
        model = Vehicle
        fields = [
            'vehicle_type',
            'fuel_type',
            'is_available',
            'min_year',
            'max_year',
            'min_mileage',
            'max_mileage'
        ]