import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Custom styles for the dialog
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

// Props type definition
type CustomizedDialogsProps = {
  open: boolean;
  onClose: () => void;
};

export default function CustomizedDialogs({ open, onClose }: CustomizedDialogsProps) {
  return (
    <BootstrapDialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Help Guide
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Welcome to the Help Section!
        </Typography>
        <Typography paragraph>
          Click on a section below to view detailed instructions.
        </Typography>

        {/* Accordion Section */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="view-lesson-content"
            id="view-lesson-header"
          >
            <Typography>View Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Click on a course/classroom/student to view its information.
              <ul>
                <li>
                  A course has starting time, duration, the classroom it's going to be, and the students who take
                  that course. It's possible to find and change the classroom of the course by clicking classroom. Also,
                  a weekly table for that course. You can remove a student from that course.
                </li>
                <li>
                  A classroom has capacity, how many courses it holds, and available hours. You can see the course list
                  and the weekly table.
                </li>
                <li>
                  A student has their courses and weekly tables. You can add or remove a course from a student.
                </li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Additional Accordions */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="add-course-content"
            id="add-course-header"
          >
            <Typography>Adding A New Course</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <ul>
                <li>
                  You can add a new course by clicking "New Course" button. Enter the instructor and course information.
                  You can select the student then confirm it by pressing "Add Students". Enter the stating time and
                  duration then you can find available classrooms to choose from.
                </li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="import-data-content"
            id="import-data-header"
          >
            <Typography>Importing Data</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              -You can import new .csv files to use the program. The `.csv` files must be named "Courses.csv" or
              "ClassroomCapacity.csv". Upload the file via the settings menu and click "Distribute" to allocate courses
              to classrooms.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
