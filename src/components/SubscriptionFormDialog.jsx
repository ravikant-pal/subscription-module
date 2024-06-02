import { CheckCircleRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/constants';

const SubscriptionFormDialog = ({
  open,
  setOpen,
  subscriptions,
  setSubscriptions,
}) => {
  const [hotelId, setHotelId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [term, setTerm] = useState('MONTHLY');
  const [errors, setErrors] = useState({});
  const [apiErrMsg, setApiErrMsg] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const handleClose = () => {
    setHotelId('');
    setStartDate(null);
    setTerm('MONTHLY');
    setErrors({});
    setOpen(false);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!hotelId) newErrors.hotelId = 'Hotel ID is required';
    if (!startDate) newErrors.startDate = 'Start Date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const sub = {
      hotelId,
      startDate: new Date(startDate).toLocaleDateString(),
      term,
    };

    setSubscribing(true);
    axios
      .post(API_URL, sub)
      .then((res) => {
        console.log(res);
        setSubscribing(false);
        setSubscriptions([res.data, ...subscriptions]);
        handleClose();
      })
      .catch((err) => {
        setApiErrMsg(err.response.data || 'Opps! Somthing went wrong!');
        setSubscribing(false);
      });
  };

  useEffect(() => {
    if (apiErrMsg) {
      const timeout = setTimeout(() => {
        setApiErrMsg('');
      }, 2000);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [apiErrMsg]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        {apiErrMsg && <Alert severity='error'>{apiErrMsg}</Alert>}

        <DialogContentText>
          To subscribe to the Hotel, please enter below inforamtion.
        </DialogContentText>
        <Stack spacing={3}>
          <TextField
            required
            fullWidth
            autoFocus
            id='hotleId'
            type='number'
            margin='dense'
            name='hotelId'
            value={hotelId}
            label='Hotel ID'
            variant='standard'
            error={!!errors.hotelId}
            helperText={errors.hotelId}
            onChange={(e) => setHotelId(e.target.value)}
          />
          <DatePicker
            label='Start Date *'
            name='startDate'
            id='startDate'
            disablePast
            format='DD/MM/YYYY'
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{
              textField: {
                variant: 'standard',
                fullWidth: true,
                error: !!errors.startDate,
                helperText: errors.startDate,
              },
            }}
          />

          <FormControl
            variant='standard'
            name='term'
            id='term'
            fullWidth
            required
          >
            <InputLabel id='subscription-plan-label'>
              Subscription Plan
            </InputLabel>
            <Select
              labelId='subscription-plan-label'
              id='subscription-plan'
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              label='Subscription Plan'
            >
              <MenuItem value={'MONTHLY'}>Monthly</MenuItem>
              <MenuItem value={'YEARLY'}>Yearly</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          size='small'
          color='inherit'
          sx={{ textTransform: 'none' }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          variant='outlined'
          size='small'
          color='success'
          loading={subscribing}
          sx={{ textTransform: 'none' }}
          startIcon={<CheckCircleRounded />}
          onClick={handleSubmit}
        >
          Subscribe
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default SubscriptionFormDialog;
