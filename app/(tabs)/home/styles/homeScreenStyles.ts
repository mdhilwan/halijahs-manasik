import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

/**
 * Common/Shared styles used across home screen files
 */
export const commonStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
    fontFamily: 'Mulish-Bold',
    paddingVertical: 20,
    flexShrink: 1
  }
});

/**
 * Styles for index.tsx (HomeScreen)
 */
export const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  switchToggleContainer: {
    height: 50,
    maxWidth: 400,
    width: '100%',
    marginHorizontal: 'auto',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 4,
  },
  switchToggleSlider: {
    position: 'absolute',
    width: '50%',
    height: 42,
    backgroundColor: Colors.light.tint,
    borderRadius: 21,
    left: 4,
    zIndex: 1,
  },
  switchToggleSliderUmrah: {
    left: 'auto',
    right: 4,
  },
  switchToggleLabelContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  switchToggleLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  switchToggleLabelActive: {
    color: '#ffd65c',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3d3d3d',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3d3d3d',
  },
  toggleButtonTextActive: {
    color: '#ffd65c',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    maxWidth: 190,
    height: 75,
    backgroundColor: Colors.light.tint,
    borderRadius: 16,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#3d3d3d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  bgButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  bgButtonText: {
    color: "#233125",
    fontWeight: 'bold',
    width: '90%',
    textAlign: 'right',
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
  heroImage: {
    height: 178,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  buttonText: {
    color: '#ffd65c',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Mulish-Bold',
  },
});

/**
 * Styles for duaDetail.tsx
 */
export const duaDetailStyles = StyleSheet.create({
  ...commonStyles,
  fontSettings: {
    fontSize: 20,
  },
  drawerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    padding: 0,
    marginBottom: 0,
    paddingBottom: 0,
    height: '100%'
  },
  textWrapper: {
    width: "100%",
    marginRight: 5,
    marginBottom: 5,
    flexShrink: 1,
    paddingBottom: 10
  },
  translation: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Mulish-Bold',
    textAlign: 'center',
  },
  back: {
    fontSize: 18,
    marginBottom: 10
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#222',
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007AFF',
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starButton: {
    marginRight: 15,
  },
});

/**
 * Styles for duaList.tsx
 */
export const duaListStyles = StyleSheet.create({
  ...commonStyles,
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  listItem: {
    backgroundColor: Colors.light.tint,
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    width: '100%'
  },
  listItemTablet: {
    width: '49%',
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: "transparent",
  },
  iconContainer: {
    marginRight: 8,
  },
  listText: {
    fontSize: 18,
    fontFamily: 'Mulish-Bold',
    textTransform: 'capitalize',
    flex: 1,
    color: Colors.base.tint
  },
});

