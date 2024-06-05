import {
  AddCircleOutlineRounded,
  CancelRounded,
  CheckCircleRounded,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import SubscriptionFormDialog from './components/SubscriptionFormDialog';
import { API_URL } from './utils/constants';

function App() {
  const [status, setStatus] = useState('ALL');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [loadingSubscriptionList, setLoadingSubscriptionList] = useState(false);
  const [cancelingSubscription, setCancelingSubscription] = useState({});
  const [resubscribing, setResubscribing] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);

  const getAllSubscriptions = async () => {
    let queryString = '?';
    if (status && status !== 'ALL') {
      queryString += `status=${status}`;
    }
    if (startDate) {
      queryString += `${queryString ? '&' : ''}startDate=${new Date(
        startDate
      ).toLocaleDateString()}`;
    }
    setLoadingSubscriptionList(true);
    axios
      .get(API_URL + queryString)
      .then((res) => {
        setLoadingSubscriptionList(false);
        setSubscriptions(res.data);
      })
      .catch((err) => {
        alert('Oops! Something went wrong!');
        setLoadingSubscriptionList(false);
      });
  };

  const handleStatusChange = async (id, status) => {
    if (status === 'CANCELED')  setCancelingSubscription(prevState => ({ ...prevState, [id]: true }));
    if (status === 'ACTIVE')  setResubscribing(prevState => ({ ...prevState, [id]: true }));
    axios
      .put(API_URL + `/${id}?status=${status}`)
      .then((res) => {
        if (status === 'CANCELED') setCancelingSubscription(prevState => ({ ...prevState, [id]: false }));
        if (status === 'ACTIVE') setResubscribing(prevState => ({ ...prevState, [id]: false }));
        getAllSubscriptions();
      })
      .catch((err) => {
        alert('Oops! Something went wrong!');
        if (status === 'CANCELED') setCancelingSubscription(prevState => ({ ...prevState, [id]: false }));
        if (status === 'ACTIVE') setResubscribing(prevState => ({ ...prevState, [id]: false }));
      });
  };

  useEffect(() => {
    getAllSubscriptions();
  }, [status, startDate]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Typography variant='h3' textAlign='center' mb={1}>
            Subscriptions
          </Typography>
          <Divider />
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            spacing={2}
            m={1}
          >
            <Stack direction='row' spacing={2}>
              <FormControl
                variant='standard'
                size='small'
                sx={{ minWidth: 100 }}
              >
                <InputLabel id='status-dropdown-label'>Status</InputLabel>
                <Select
                  labelId='status-dropdown-label'
                  id='status-dropdown-label'
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label='Status'
                >
                  <MenuItem value='ALL'>
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value={'ACTIVE'}>Active</MenuItem>
                  <MenuItem value={'EXPIRED'}>Expired</MenuItem>
                  <MenuItem value={'CANCELED'}>Canceled</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label='Start month'
                value={startDate}
                format='MMMM'
                views={['month']}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  field: { clearable: true, onClear: () => setStartDate(null) },
                  textField: {
                    size: 'small',
                    variant: 'standard',
                    sx: { minWidth: 100 },
                  },
                }}
              />
            </Stack>
            <Button
              variant='outlined'
              size='small'
              startIcon={<AddCircleOutlineRounded />}
              onClick={() => {
                setOpenAddDialog(true);
              }}
              sx={{ textTransform: 'none' }}
            >
              New
            </Button>
          </Stack>
          <SubscriptionFormDialog
            open={openAddDialog}
            setOpen={setOpenAddDialog}
            subscriptions={subscriptions}
            setSubscriptions={setSubscriptions}
          />
          {loadingSubscriptionList ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100px',
              }}
            >
              <CircularProgress color='info' size={20} />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align='center'>Status</TableCell>
                    <TableCell align='center'>Next Payment Date</TableCell>
                    <TableCell align='right'>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subscriptions.map((sub) => (
                    <TableRow
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      key={sub.id}
                    >
                      <TableCell component='th' scope='row'>
                        {sub.id}
                      </TableCell>
                      <TableCell align='center'>
                        {sub.endDate && sub.endDate <= new Date() ? (
                          <Chip
                            label='EXPIRED'
                            color='default'
                            variant='outlined'
                            size='small'
                          />
                        ) : (
                          <Chip
                            label={sub.status}
                            color={
                              sub.status === 'ACTIVE'
                                ? 'success'
                                : sub.status === 'CANCELED'
                                ? 'error'
                                : 'default'
                            }
                            variant='outlined'
                            size='small'
                          />
                        )}
                      </TableCell>
                      <TableCell align='center'>
                        {sub.status === 'ACTIVE'
                          ? moment(sub.nextPaymentOn).format('ll')
                          : '-'}
                      </TableCell>
                      <TableCell align='right'>
                        {sub.status === 'ACTIVE' && (
                          <LoadingButton
                            size='small'
                            color='error'
                            variant='outlined'
                            loading={cancelingSubscription[sub.id]}
                            sx={{ textTransform: 'none' }}
                            onClick={() =>
                              handleStatusChange(sub.id, 'CANCELED')
                            }
                            startIcon={<CancelRounded />}
                          >
                            Cancel
                          </LoadingButton>
                        )}
                        {sub.status === 'CANCELED' && (
                          <LoadingButton
                            size='small'
                            color='success'
                            variant='outlined'
                            loading={resubscribing[sub.id]}
                            sx={{ textTransform: 'none' }}
                            startIcon={<CheckCircleRounded />}
                            onClick={() => handleStatusChange(sub.id, 'ACTIVE')}
                          >
                            Resubscribe
                          </LoadingButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
