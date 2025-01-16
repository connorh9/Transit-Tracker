import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Modal,
    Switch,
    ActivityIndicator,
    SectionList,
    SafeAreaView,
    StatusBar,
    FlatList,
} from "react-native";
import axios from "axios";
import { Ionicons } from '@expo/vector-icons';

//Colors for styling, can easily change
const lineColors = {
    Red: '#c60c30',
    Blue: '#00a1de',
    Green: '#009b3a',
    Brown: '#62361b',
    Purple: '#522398',
    'Purple (Express)': '#522398',
    Pink: '#e27ea6',
    Yellow: '#f9e300',
    Orange: '#f9461c',
  };

function Trains() {
    const [stations, setStations] = useState({});
    const [filteredStations, setFilteredStations] = useState({});
    const [search, setSearch] = useState("");
    const [dropdownStates, setDropdownStates] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        //Add filters here as we need
        red: true,
        blue: true,
        g: true,
        brn: true,
        p: true,
        pexp: true,
        pnk: true,
        y: true,
        o: true,
        
    });
    const [isFiltered, setIsFiltered] = useState(false);

    const addUniqueStation = (lineArray, station) => {
        // Check if station already exists in this lines array
        if (!lineArray.some(existingStation => existingStation.stop_id === station.stop_id)) {
            lineArray.push(station);
        }
    };

    const groupStationsByLine = (stations) => {
        return stations.reduce((acc, station) => {
        
            if (station.red) { 
                acc.Red = acc.Red || []; 
                addUniqueStation(acc.Red, station);
            }
            if (station.blue) { 
                acc.Blue = acc.Blue || []; 
                addUniqueStation(acc.Blue, station);
            }
            if (station.g) { 
                acc.Green = acc.Green || []; 
                addUniqueStation(acc.Green, station);
            }
            if (station.brn) { 
                acc.Brown = acc.Brown || []; 
                addUniqueStation(acc.Brown, station);
            }
            if (station.p) { 
                acc.Purple = acc.Purple || []; 
                addUniqueStation(acc.Purple, station);
            }
            if (station.pexp) { 
                acc["Purple (Express)"] = acc["Purple (Express)"] || []; 
                addUniqueStation(acc["Purple (Express)"], station);
            }
            if (station.pnk) { 
                acc.Pink = acc.Pink || []; 
                addUniqueStation(acc.Pink, station);
            }
            if (station.y) { 
                acc.Yellow = acc.Yellow || []; 
                addUniqueStation(acc.Yellow, station);
            }
            if (station.o) { 
                acc.Orange = acc.Orange || []; 
                addUniqueStation(acc.Orange, station);
            }
            return acc;
        }, {});
    };

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await axios.get(
                    "https://data.cityofchicago.org/resource/8pix-ypme.json"
                );
                
                const groupedStations = groupStationsByLine(response.data);
                setStations(groupedStations);
                setFilteredStations(groupedStations);
                setDropdownStates(
                    Object.keys(groupedStations).reduce((acc, line) => {
                        acc[line] = false;
                        return acc;
                    }, {})
                );
                // Organize stations by line color
                // const groupedByLines = response.data.reduce((acc, station) => {
                //     const lines = [];

                    // if (station.red === true) lines.push("Red");
                    // if (station.blue === true) lines.push("Blue");
                    // if (station.g === true) lines.push("Green");
                    // if (station.brn === true) lines.push("Brown");
                    // if (station.pexp === true) lines.push("Purple (Express)");
                    // if (station.p === true) lines.push("Purple");
                    // if (station.pnk === true) lines.push("Pink");
                    // if (station.y === true) lines.push("Yellow");
                    // if (station.o === true) lines.push("Orange");

                    // lines.forEach((line) => {
                    //     if (!acc[line]) acc[line] = [];
                    //     acc[line].push(station);
                    // });

                    // return acc;
                
            } catch (error) {
                console.error("Error fetching train station data:", error);
            } finally{
                setIsLoading(false);
            }
        };

        fetchStations();
    }, []);

    

    

    const handleSearch = (text) => {
        setSearch(text);

        const currentStations = isFiltered ? filteredStations : stations;

        // Generate suggestions for autofill
        const allStops = Object.values(currentStations).flat();
        const matchedSuggestions = allStops
            .filter((stop) =>
                stop.station_name.toLowerCase().includes(text.toLowerCase())
            )
            .map((stop) => stop.station_name);
        setSuggestions([...new Set(matchedSuggestions)]);

        // Filter stations by search query
        const filtered = Object.entries(currentStations).reduce((acc, [line, stops]) => {
            const filteredStops = stops.filter((stop) =>
                stop.station_name.toLowerCase().includes(text.toLowerCase())
            );
            if (filteredStops.length > 0) acc[line] = filteredStops;
            return acc;
        }, {});

        setFilteredStations(filtered);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearch(suggestion);
        handleSearch(suggestion);
        setSuggestions([]);
    };

    const toggleDropdown = (line) => {
        setDropdownStates((prevState) => ({
            ...prevState,
            [line]: !prevState[line],
        }));
    };

    const toggleFilterModal = () => {
        setIsFilterModalVisible(!isFilterModalVisible);
    };

    const clearFilters = () => {
        setFilters({
            red: true,
            blue: true,
            g: true,
            brn: true,
            pexp: true,
            p: true,
            pnk: true,
            y: true,
            o: true,
        });
        setFilteredStations(stations);
        setIsFiltered(false);
    };
    const applyFilters = () => {
        
        // const filtered = stations.filter((station) => {
        //   //Example filter logic.  Adjust to your needs.
        //     const activeFilters = Object.entries(filters)
        //         .filter(([_, isEnabled]) => isEnabled)
        //         .map(([filterKey]) => filterKey);
            
        //     // Check if station has all required lines
        //     return activeFilters.every(filterKey => station[filterKey]);
        // });
        // setFilteredStations(filtered);
        // toggleFilterModal();
        // setIsFiltered(true);
        const allStations = Object.values(stations).flat();
        const filteredStations = allStations.filter(station => 
            Object.entries(filters)
                .filter(([_, isEnabled]) => isEnabled)
                .some(([key]) => station[key])
        );

        const regrouped = groupStationsByLine(filteredStations, filters);
        
        setFilteredStations(regrouped);
        toggleFilterModal();
        setIsFiltered(true);
    };
    const renderFilterItem = ({ item }) => (
        <View style={styles.filterItem}>
          <Text style={styles.filterItemText}>{item.label}</Text>
          <Switch
            value={filters[item.key]}
            onValueChange={(value) => setFilters({ ...filters, [item.key]: value })}
            trackColor={{ false: '#767577', true: lineColors[item.label] }}
            thumbColor={filters[item.key] ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>
      );

    return (
        //SafeAreaView makes sure the content is rendered within the screen
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading Stations...</Text>
                </View>
            ) : (
            <>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Chicago Train Stations</Text>
                    <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
                        <Ionicons name="filter" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchBar}
                        placeholder="Search by Station Name"
                        value={search}
                        onChangeText={handleSearch}
                    />
                </View>
                {suggestions.length > 0 && (
                <ScrollView style={styles.suggestionsContainer}>
                    {suggestions.map((suggestion, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleSuggestionClick(suggestion)}
                        style={styles.suggestionItem}
                    >
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                    ))}
                </ScrollView>
                )}
                <SectionList
                sections={Object.entries(filteredStations).map(([line, stops]) => ({
                    title: line,
                    data: dropdownStates[line] ? stops : [],
                    stops: stops.length,
                }))}
                renderItem={({ item, section }) => (
                    <View style={styles.stopCard}>
                        <View style={[styles.stopColorIndicator, { backgroundColor: lineColors[section.title] }]} />
                        <View style={styles.stopInfo}>
                            <Text style={styles.stopName}>{item.station_name}</Text>
                            <Text style={styles.stopId}>Stop ID: {item.stop_id}</Text>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <TouchableOpacity
                    onPress={() => toggleDropdown(section.title)}
                    style={[styles.sectionHeader, { borderLeftColor: lineColors[section.title] }]}
                    >
                    <Text style={styles.lineTitle}>
                        {section.title} Line ({section.stops} stops)
                    </Text>
                    <Ionicons
                        name={dropdownStates[section.title] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="#666"
                    />
                    </TouchableOpacity>
                )}
                stickySectionHeadersEnabled={true}
                keyExtractor={(item, index) => `${item.stop_id}-${index}`}
                />
                {isFiltered && (
                <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
                    <Text style={styles.clearFiltersText}>Clear Filters</Text>
                </TouchableOpacity>
                )}
          </>
        )}
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={isFilterModalVisible}
            onRequestClose={toggleFilterModal}
        >
            <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Filter Stations</Text>
                <FlatList
                data={[
                    { key: 'red', label: 'Red' },
                    { key: 'blue', label: 'Blue' },
                    { key: 'g', label: 'Green' },
                    { key: 'brn', label: 'Brown' },
                    { key: 'p', label: 'Purple' },
                    { key: 'pexp', label: 'Purple (Express)' },
                    { key: 'pnk', label: 'Pink' },
                    { key: 'y', label: 'Yellow' },
                    { key: 'o', label: 'Orange' },
                ]}
                renderItem={renderFilterItem}
                keyExtractor={(item) => item.key}
                />
                <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={applyFilters}>
                    <Text style={styles.modalButtonText}>Apply Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={toggleFilterModal}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f4f4',
      },
      container: {
        flex: 1,
        padding: 16,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      },
      headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
      },
      searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      searchIcon: {
        marginRight: 8,
      },
      searchBar: {
        flex: 1,
        height: 40,
        fontSize: 16,
      },
      suggestionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 16,
        maxHeight: 150,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      suggestionText: {
        fontSize: 16,
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderLeftWidth: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      lineTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      stopCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
      stopColorIndicator: {
        width: 8,
        height: '100%',
        borderRadius: 4,
        marginRight: 12,
      },
      stopInfo: {
        flex: 1,
      },
      stopName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
      },
      stopId: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
      },
      filterButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
      },
      clearFiltersButton: {
        backgroundColor: '#ff4444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      clearFiltersText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
      },
      filterItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
      },
      filterItemText: {
        fontSize: 16,
        color: '#333',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      modalButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 4,
      },
      cancelButton: {
        backgroundColor: '#ff4444',
      },
      modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#666',
      },
});

export default Trains;
