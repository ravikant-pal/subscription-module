import {
  AddCircleOutlineRounded,
  CancelRounded,
  CheckCircleRounded,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Chip,
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
import { useEffect, useState } from 'react';
import SubscriptionFormDialog from './components/SubscriptionFormDialog';
import { API_URL } from './utils/constants';

function App() {
  const [status, setStatus] = useState('ALL');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [loadingSubscriptionList, setLoadingSubscriptionList] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  const handleStatusChange = (e) => {
    console.log(e.target.value);
    setStatus(e.target.value);
  };

  const getAllSubscriptions = async () => {
    let queryString = '';
    if (status) {
      queryString += `?status=${status}`;
    }
    if (startDate) {
      queryString += `${queryString ? '&' : ''}startDate=${startDate}`;
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
                <InputLabel id='status-dropdown-label'>
                  Filter by status
                </InputLabel>
                <Select
                  labelId='status-dropdown-label'
                  id='status-dropdown-label'
                  value={status}
                  onChange={handleStatusChange}
                  label=' Filter by status'
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
                label='Filter by start date'
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
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
          />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell align='center'>Status</TableCell>
                  <TableCell>Next Payment Date</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    ID
                  </TableCell>
                  <TableCell align='center'>
                    <Chip
                      label='Active'
                      color='success'
                      variant='outlined'
                      size='small'
                    />
                    <Chip
                      label='Canceled'
                      color='error'
                      variant='outlined'
                      size='small'
                    />
                    <Chip
                      label='Expired'
                      color='default'
                      variant='outlined'
                      size='small'
                    />
                  </TableCell>
                  <TableCell>2020/12/12</TableCell>
                  <TableCell align='center'>
                    <Stack direction='row' spacing={2} justifyContent='center'>
                      <LoadingButton
                        size='small'
                        color='error'
                        variant='outlined'
                        sx={{ textTransform: 'none' }}
                        startIcon={<CancelRounded />}
                      >
                        Cancel
                      </LoadingButton>
                      <LoadingButton
                        size='small'
                        color='success'
                        variant='outlined'
                        sx={{ textTransform: 'none' }}
                        startIcon={<CheckCircleRounded />}
                      >
                        Resubscribe
                      </LoadingButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
