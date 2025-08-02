import pytest
from unittest.mock import Mock, patch
from app.services.mapbox_service import MapboxService
from requests import RequestException

class TestMapboxService:
    """Test Mapbox service functionality"""
    
    def setup_method(self):
        self.mapbox_service = MapboxService()
        self.sample_address = "123 Main St, Toronto, ON"
        self.sample_coordinates = (43.6532, -79.3832)

    @patch('app.services.mapbox_service.requests.get')
    def test_geocode_address_success(self, mock_get):
        """Test successful address geocoding"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'features': [
                {
                    'center': [43.6532, -79.3832],
                    'place_name': '123 Main St, Toronto, ON',
                    'properties': {}
                }
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.mapbox_service.geocode_address(self.sample_address)
        
        assert len(result) == 1
        assert result[0]['center'] == [43.6532, -79.3832]
        assert result[0]['place_name'] == '123 Main St, Toronto, ON'

    @patch('app.services.mapbox_service.requests.get')
    def test_geocode_address_failure(self, mock_get):
        """Test address geocoding failure"""
        mock_get.side_effect = RequestException("API Error")
        
        result = self.mapbox_service.geocode_address(self.sample_address)
        
        assert result == []

    @patch('app.services.mapbox_service.requests.get')
    def test_get_directions_success(self, mock_get):
        """Test successful directions retrieval"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'routes': [
                {
                    'legs': [
                        {
                            'distance': 50000,  # 50km in meters
                            'duration': 3600,   # 1 hour in seconds
                        }
                    ],
                    'geometry': {
                        'coordinates': [
                            [43.6532, -79.3832],
                            [43.6533, -79.3833]
                        ]
                    }
                }
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.mapbox_service.get_directions(
            "123 Main St, Toronto, ON",
            "456 Oak Ave, Vancouver, BC"
        )
        
        assert result is not None
        assert result['distance'] == 50000
        assert result['duration'] == 3600
        assert len(result['coordinates']) == 2

    @patch('app.services.mapbox_service.requests.get')
    def test_get_directions_no_routes(self, mock_get):
        """Test directions retrieval with no routes"""
        mock_response = Mock()
        mock_response.json.return_value = {'routes': []}
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.mapbox_service.get_directions(
            "123 Main St, Toronto, ON",
            "456 Oak Ave, Vancouver, BC"
        )
        
        assert result is None

    @patch('app.services.mapbox_service.requests.get')
    def test_get_directions_failure(self, mock_get):
        """Test directions retrieval failure"""
        mock_get.side_effect = RequestException("API Error")
        
        result = self.mapbox_service.get_directions(
            "123 Main St, Toronto, ON",
            "456 Oak Ave, Vancouver, BC"
        )
        
        assert result is None

    @patch('app.services.mapbox_service.requests.get')
    def test_get_distance_from_coordinates_success(self, mock_get):
        """Test successful distance calculation from coordinates"""
        mock_response = Mock()
        mock_response.json.return_value = {
            'routes': [
                {
                    'legs': [
                        {
                            'distance': 50000,  # 50km in meters
                            'duration': 3600,   # 1 hour in seconds
                        }
                    ]
                }
            ]
        }
        mock_response.raise_for_status.return_value = None
        mock_get.return_value = mock_response
        
        result = self.mapbox_service.get_distance_from_coordinates(
            (43.6532, -79.3832),
            (43.6533, -79.3833)
        )
        
        assert result is not None
        assert result['distance_km'] == 50.0
        assert result['duration_hours'] == 1.0

    @patch('app.services.mapbox_service.requests.get')
    def test_get_distance_from_coordinates_failure(self, mock_get):
        """Test distance calculation failure"""
        mock_get.side_effect = RequestException("API Error")
        
        result = self.mapbox_service.get_distance_from_coordinates(
            (43.6532, -79.3832),
            (43.6533, -79.3833)
        )
        
        assert result is None

    @patch('app.services.mapbox_service.MapboxService.geocode_address')
    def test_validate_address_true(self, mock_geocode):
        """Test address validation returning True"""
        mock_geocode.return_value = [{'center': [43.6532, -79.3832]}]
        
        result = self.mapbox_service.validate_address(self.sample_address)
        
        assert result is True

    @patch('app.services.mapbox_service.MapboxService.geocode_address')
    def test_validate_address_false(self, mock_geocode):
        """Test address validation returning False"""
        mock_geocode.return_value = []
        
        result = self.mapbox_service.validate_address(self.sample_address)
        
        assert result is False

    @patch('app.services.mapbox_service.MapboxService.geocode_address')
    def test_get_coordinates_success(self, mock_geocode):
        """Test successful coordinate retrieval"""
        mock_geocode.return_value = [{'center': [43.6532, -79.3832]}]
        
        result = self.mapbox_service.get_coordinates(self.sample_address)
        
        assert result == (43.6532, -79.3832)

    @patch('app.services.mapbox_service.MapboxService.geocode_address')
    def test_get_coordinates_failure(self, mock_geocode):
        """Test coordinate retrieval failure"""
        mock_geocode.return_value = []
        
        result = self.mapbox_service.get_coordinates(self.sample_address)
        
        assert result is None

    def test_geocode_address_with_country(self):
        """Test geocoding with country parameter"""
        with patch('app.services.mapbox_service.requests.get') as mock_get:
            mock_response = Mock()
            mock_response.json.return_value = {'features': []}
            mock_response.raise_for_status.return_value = None
            mock_get.return_value = mock_response
            
            self.mapbox_service.geocode_address(self.sample_address, country="CA")
            
            # Verify country parameter was passed
            call_args = mock_get.call_args
            assert 'country' in call_args[1]['params']
            assert call_args[1]['params']['country'] == 'CA' 