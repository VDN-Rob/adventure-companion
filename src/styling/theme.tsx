const colours = {
    background: '#0E1514',
    surface: '#17211F',
    surfaceRaised: '#1D2926',
  
    text: '#E9E5D6',
    textSecondary: '#9BA69E',
    textMuted: '#65716B',
  
    accent: '#E3A847',
    accentBright: '#F2BE5C',
  
    green: '#789B73',
    red: '#C96B5B',
  
    border: '#34423D',
    borderStrong: '#53635B',
  
    mapBackground: '#141E1C',
    route: '#E3A847',
};
  
const borders = {
    thin: 1,
    thick: 2,
};

const radius = {
    none: 0,
    sm: 4,
    md: 6,
    lg: 10,
};

const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 48,
};

  // FONTS
const typography = {
    display: {
      fontFamily: 'Rajdhani-SemiBold',
    },
  
    displayBold: {
      fontFamily: 'Rajdhani-Bold',
    },
  
    body: {
      fontFamily: 'Inter-Regular',
    },
  
    bodyMedium: {
      fontFamily: 'Inter-Medium',
    },
  
    bodyBold: {
      fontFamily: 'Inter-SemiBold',
    },
};

const fontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 32,
    xxxl: 42,
};


const fonts = {
  display: 'Rajdhani-Regular',
  displayMedium: 'Rajdhani-SemiBold',
  displayBold: 'Rajdhani-Bold',

  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodyBold: 'Inter-SemiBold',
}

// BUNDLE EVERYTHING
export const theme = {
    fonts, 
    
    colours,
  
    typography,
  
    fontSize,
  
    spacing,
  
    radius,
  
    borders,
  
    layout: {
      screenPadding: 16,
      headerHeight: 72,
      bottomBarHeight: 72,
    },
};