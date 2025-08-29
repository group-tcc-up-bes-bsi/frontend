import React from 'react';
import { useTheme } from '@/app/theme/ThemeContext';
import { Box, Backdrop } from '@mui/material';
import { useMsgConfirmStore } from '@/app/state/msgConfirmState';
import CustomButton from '../CustomButton';
import CustomTypography from '../CustomTypography';

const MsgConfirm: React.FC = () => {
    const { theme } = useTheme();
    const alterMsgConfirm = useMsgConfirmStore((state) => state.alter);
    const msgConfirm = useMsgConfirmStore((state) => state.msgConfirm);
    const textMsg = 'Deseja realmente ' + msgConfirm;
    
    return (
        <Box className="flex items-center justify-center">
            <Backdrop
                open={true}
                onClick={() => alterMsgConfirm(false)}
                sx={{
                    zIndex: 1320,
                    color: '#fff',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}
            />
            <Box
                sx={{
                    display: 'flex',
                    zIndex: 1330,
                    position: 'fixed',
                    flexDirection: 'column',
                    alignItems: 'center',
                    item: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.paper,
                    width: '400px',
                    height: '200px',
                    borderRadius: '4px',
                    gap: 4,
                    boxShadow: theme.shadows[3],
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    p: 2
                }}
            >
                <CustomTypography
                    text={textMsg}
                    component="h5"
                    variant='h6'
                    align="center"
                    className="font-bold"
                    sx={{ color: theme.palette.text.primary }}
                />
                <CustomButton
                    text="Confirmar"
                    fullWidth={false}
                    type="button"
                    colorType="primary"
                    hoverColorType="primary"
                    paddingY={1}
                    paddingX={2}
                    marginTop={0.5}
                    sx={{width: '70%'}}
                />
            </Box>
        </Box>
    );
};

export default MsgConfirm;