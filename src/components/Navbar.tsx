import { useState } from 'react';
import { 
  AppBar, Toolbar, IconButton, Box, Drawer, List, 
  ListItem, ListItemText, Menu, MenuItem, 
  useMediaQuery, useTheme, Divider, ListItemIcon, Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListIcon from '@mui/icons-material/List';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import '../styles/Navbar.css';
import logo from '../assets/logo.png';


const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

 const menuItems = [
  { text: 'Avoimet tehtävät', icon: <ListIcon /> },
  { text: 'Suoritetut tehtävät', icon: <CheckCircleOutlineIcon /> },
  { text: 'Asetukset', icon: <SettingsIcon /> },
  { text: 'Ohjeet', icon: <HelpOutlineIcon /> },
];

  return (
    <AppBar position="sticky" className="navbar-container">
      <Toolbar className="navbar-toolbar" sx={{ minHeight: isMobile ? '60px' : '70px' }}>
        
        {/* VASEN */}
        <Box className="navbar-left">
          <IconButton color="inherit" onClick={() => setIsDrawerOpen(true)}>
            <MenuIcon fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        </Box>

       {/* KESKI */}
        <Box className="navbar-center">
        <Box
            component="img"
            src={logo}
            alt="TaSK ManaGer"
            sx={{
            height: isMobile ? 126 : 82,
            width: 'auto'
            }}
        />
        </Box>


        {/* OIKEA */}
        <Box className="navbar-right">
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircle fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
        </Box>

        {/* MOBIILIDRAWER*/}
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          PaperProps={{ sx: { width: '70%', maxWidth: '300px' } }}
        >
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ px: 2, pb: 2, fontWeight: 'bold' }}>
              Valikko
            </Typography>
            <Divider />
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.text} onClick={() => setIsDrawerOpen(false)} sx={{ py: 1.5 }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* PROFIILIVALIKKO */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileMenuClose}
          sx={{ mt: '45px' }}
        >
          <MenuItem onClick={handleProfileMenuClose}>Oma profiili</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>Kirjaudu ulos</MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;