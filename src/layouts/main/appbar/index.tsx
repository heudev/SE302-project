import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IeuLogo from "../../../assets/ieu-logo.png";
import { useNavigate, useLocation } from 'react-router-dom';

import ImportFiles from "./components/ImportFiles";
import DistributeClassroomsButton from './components/DistributeClassroomsButton';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';


export default function AppBarComponent() {

    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogoClick = () => {
        navigate('/');
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <img
                        src={IeuLogo}
                        alt="IEU Timetable"
                        width={40}
                        className='me-3'
                        onContextMenu={e => e.preventDefault()}
                        draggable="false"
                        onClick={handleLogoClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        IEU.APP v2
                    </Typography>
                    <div className='space-x-1'>
                        <Button
                            color={location.pathname === '/' ? "secondary" : "primary"}
                            variant='contained'
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                        <Button
                            color={location.pathname === '/newcourse' ? "secondary" : "primary"}
                            variant='contained'
                            onClick={() => navigate('/newcourse')}
                        >
                            New Course
                        </Button>
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="settings"
                            onClick={handleMenuClick}
                        >
                            <SettingsIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem disableRipple style={{ justifyContent: 'center' }}>
                                <DistributeClassroomsButton />
                            </MenuItem>
                            <MenuItem disableRipple style={{ justifyContent: 'center' }}>
                                <ImportFiles />
                            </MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
            </AppBar>
        </Box>
    );
}