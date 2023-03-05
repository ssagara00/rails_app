import React from 'react';
import Button from '@mui/material/Button';
import MyDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export type DialogProps = {
  onClose: (value: string) => void
  title?: string
  message?: string
}

export function Dialog(props: DialogProps) {
  const { onClose, title, message } = props
 
  return (
     <MyDialog open onClose={() => onClose('close')}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
         <Button onClick={() => onClose('ok')}>はい</Button>
         <Button onClick={() => onClose('cancel')} autoFocus>
          いいえ
        </Button>
      </DialogActions>
    </MyDialog>
  )
 }