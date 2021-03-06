import { Container, Box, Grid, Pagination } from '@material-ui/core';

import Layout from '../layouts/base.layout';

import DashboardLayout from '../layouts/dashboard.layout';

import TutorStudentCard from './card.tutorstudent';

const TutorStudentPage = ({
  commonStudents,
}: {
  commonStudents: CommonStudentsApi[];
}) => (
  <>
    <DashboardLayout>
      <Layout title="Lantutors: Common Students">
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
          }}
        >
          <Container maxWidth={false}>
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {commonStudents.map((commonStudent, index) => (
                  <Grid
                    item
                    key={`common-home-${index}`}
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                  >
                    <TutorStudentCard commonStudent={commonStudent} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 3,
              }}
            >
              <Pagination color="primary" count={3} size="small" />
            </Box>
          </Container>
        </Box>
      </Layout>
    </DashboardLayout>
  </>
);

export default TutorStudentPage;
