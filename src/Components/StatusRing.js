import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

const StatusRing = ({logoSource, totalSegments, activeSegments}) => {
  const segments = [];
  const segmentAngle = 360 / totalSegments;

  for (let i = 0; i < totalSegments; i++) {
    segments.push(
      <View
        key={i}
        style={{
          ...styles.segment,
          transform: [{rotate: `${i * segmentAngle}deg`}],
          backgroundColor: i < activeSegments ? '#4CAF50' : '#D3D3D3', // Green for active, gray for inactive
        }}
      >
        <View style={styles.segmentFill} />
      </View>
    );
  }

  return (
    <View style={styles.statusRingContainer}>
      <View style={styles.segmentsWrapper}>{segments}</View>
      <Image source={logoSource} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  statusRingContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentsWrapper: {
    position: 'absolute',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentFill: {
    position: 'absolute',
    width: 100,
    height: 50, // Half the width for a semicircular look
    backgroundColor: 'transparent',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    overflow: 'hidden',
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    borderRadius: 30,
  },
});

export default StatusRing;
