import {
  AddRounded,
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
  Toolbar,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

function App() {
  const [status, setStatus] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [filterDate, setFilterDate] = useState(null);

  const handleStatusChange = (e) => {
    console.log(e.target.value);
    setStatus(e.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper>
          <Typography variant='h3' textAlign='center' mb={1}>
            Subscriptions
          </Typography>
          <Divider />
          <Toolbar>
            <Grid item xs={12} sm={12} md={6}>
              <Stack
                direction='row'
                spacing={1}
                display='flex'
                justifyContent='space-around'
              >
                <FormControl fullWidth>
                  <InputLabel id='status-dropdown-label'>
                    Filter by status
                  </InputLabel>
                  <Select
                    labelId='status-dropdown-label'
                    id='status-dropdown'
                    value={status}
                    label='Filter by status'
                    size='small'
                    onChange={handleStatusChange}
                  >
                    <MenuItem value={'ACTIVE'}>Active</MenuItem>
                    <MenuItem value={'EXPIRED'}>Expired</MenuItem>
                    <MenuItem value={'CANCELED'}>Canceled</MenuItem>
                  </Select>
                </FormControl>
                <DatePicker
                  label='Filter by start date'
                  value={filterDate}
                  onChange={(newValue) => setFilterDate(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      // sx: {
                      //   '& .MuiOutlinedInput-root': {
                      //     borderRadius: 5,
                      //   },
                      //   mt: 1,
                      // },
                    },
                  }}
                />

                <Button
                  variant='outlined'
                  size='small'
                  fullWidth
                  startIcon={<AddRounded />}
                  onClick={() => {
                    setOpenAddDialog(true);
                  }}
                >
                  Add new
                </Button>
              </Stack>
            </Grid>
          </Toolbar>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Next Payment Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow
                  // key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component='th' scope='row'>
                    ID
                  </TableCell>
                  <TableCell>
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
                  <TableCell>
                    <Stack direction='row' spacing={2}>
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
