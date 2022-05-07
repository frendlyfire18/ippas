import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const theme = extendTheme({
  colors: {
    black: '#16161D',
    purple:{
      900:'#322659'
    },
    brand: {
      500: "#44337A",
      100: "#685f89",
      800: '#493d71', // you need this
    }
  },
  fonts,
  breakpoints,
})

export default theme
