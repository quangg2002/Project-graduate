import React, { useState } from 'react';
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { AspectRatio, Avatar, Box, Button, CardCover, Divider, IconButton, Input, ModalClose, Snackbar, Stack, Textarea, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import * as Yup from "yup";
import { Field, Form, Formik } from 'formik';
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { keyframes, maxHeight } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';


const customTheme = extendTheme({
	fontFamily: {
		display: '"Arima", system-ui',
		// body: '"Arima", system-ui',
	},
});

const FormCv = Yup.object().shape({
	name: Yup.string(),
	vitri: Yup.string(),
	email: Yup.string().email('Email không hợp lệ'),
	sdt: Yup.string(),
	diachi: Yup.string(),
	ngaysinh: Yup.string(),
	muctieu: Yup.string(),
	hocvan: Yup.array().of(
		Yup.object().shape({
			name: Yup.string(),
			vitri: Yup.string(),
			start: Yup.string(),
			end: Yup.string(),
			mota: Yup.string(),
		})
	)
});

const inputStyles = {
	borderRadius: '4px',
	color: '#FFFFFF',
	border: '0px',
	fontFamily: '"Arima", system-ui',
	backgroundColor: 'transparent',
	outline: 'none',
	boxShadow: 'none',
}

export default function Layout1() {
	const [open, setOpen] = useState<boolean>(false);

	const [open2, setOpen2] = React.useState(false);

	const animationDuration = 600;

	const handleClick = () => {
		setOpen2(true);
	};

	const handleClose = (event: React.SyntheticEvent | null, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpen2(false);
	};

	return (
		<CssVarsProvider disableTransitionOnChange theme={customTheme}>
			<Header />
			<CssBaseline />
			<Stack display={'flex'} flexDirection={'row'}>
				<Box width={'100%'}>
					<Formik
						initialValues={{
							name: "",
							vitri: "",
							email: "",
							sdt: "",
							diachi: "",
							ngaysinh: "",
							muctieu: "",
							hocvan: [{
								name: '',
								vitri: '',
								start: '',
								end: '',
								mota: '',
							}]
						}}
						validationSchema={FormCv}
						onSubmit={(values, { setSubmitting }) => {
							console.log(values)
							alert(JSON.stringify(values, null, 2));
							setSubmitting(false);
						}}
					>
						{({ isSubmitting, errors, touched, values, setFieldValue }) => (
							<Form>
								<Box
									sx={{
										justifySelf: 'center',
										alignSelf: 'center',
										width: "65%",
										bgcolor: "common.white",
										display: "grid",
										gridTemplateColumns: {
											sm: "35% 65%",
											md: "35% 65%",
										},
										boxShadow: 'lg',
										border: '1px solid darkgray'
									}}
								>

									<Box bgcolor={"#2b2b2b"}>
										<Box
											display={'flex'}
											flexDirection={"column"}
											justifyContent={'center'}
											alignItems={'center'}
											margin={2}
										// gap={2}
										>
											<Box position={'relative'} mb={2}>
												<Avatar src="https://i.pinimg.com/564x/eb/57/6f/eb576ff023487bcb1fa3ad61ee7b23ee.jpg" sx={{ width: '160px', height: '160px' }} />

												<IconButton
													aria-label="upload new picture"
													size="sm"
													variant="outlined"
													sx={{
														position: 'absolute',
														zIndex: 2,
														borderRadius: '50%',
														right: 20,
														bottom: 5,
														// boxShadow: 'sm',
													}}
													onClick={() => setOpen(true)}
												>
													<EditRoundedIcon />
												</IconButton>
											</Box>
											<Field
												name="name"
												as={Input}
												sx={{
													...inputStyles,
													fontSize: '23px',
													fontWeight: '700',
													"& .MuiInput-input": {
														textAlign: 'center',
													},
												}}
												fullWidth
												placeholder="Nhập họ và tên"
											/>

											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													alignSelf: 'center',
													maxWidth: '100%'
												}}
											>
												<Typography
													fontSize={'19px'}
													fontWeight={'600'}
													fontFamily={'"Arima", system-ui'}
													sx={{ color: '#f75d59' }}
												>
													Vị trí:
												</Typography>
												<Field
													name="vitri"
													as={Input}
													sx={{
														...inputStyles,
														fontSize: '19px',
														fontWeight: '600',
														color: '#f75d59',
														maxWidth: '60%',
														padding: '2px',
														"& .MuiInput-input": {
															textAlign: 'center',
															width: 'auto',
														},
													}}
												/>
											</Box>
										</Box>
										<Stack flexDirection={'row'}>
											<Box sx={{ backgroundColor: '#FFFFFF' }} p={'1px'} >&nbsp;&nbsp;&nbsp;&nbsp;</Box>
											<Box sx={{ backgroundColor: '#f75d59', borderBottomRightRadius: 11, borderTopRightRadius: 11 }} alignContent={'center'} p={'1px'}>
												<Typography sx={{ color: '#FFFFFF', fontSize: '13px' }} fontFamily={'"Arima", system-ui'} mt={"1px"}>&nbsp;&nbsp;LIÊN HỆ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
											</Box>
										</Stack>
										<Stack flexDirection={'column'} ml={3} mt={1} >
											<Box display={'flex'} alignItems={'center'}>
												<MailIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Email:
												</Typography>
												<Field
													name="email"
													as={Input}
													sx={{
														...inputStyles,
														fontSize: '13px',
														padding: '2px',
														marginTop: '1px'
													}}
												/>
											</Box>
											<Box display={'flex'} alignItems={'center'}>
												<PhoneIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Sđt:
												</Typography>
												<Field
													name="sdt"
													as={Input}
													sx={{
														...inputStyles,
														fontSize: '13px',
														padding: '2px',
														marginTop: '1px'
													}}
												/>
											</Box>
											<Box display={'flex'} alignItems={'center'}>
												<RoomIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Địa chỉ:
												</Typography>
												<Field
													name="diachi"
													as={Input}
													sx={{
														...inputStyles,
														fontSize: '13px',
														padding: '2px',
														marginTop: '1px'
													}}
												/>
											</Box>
											<Stack direction={'row'} alignItems={'center'}>
												<CalendarMonthIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Ngày sinh:
												</Typography>
												<Field
													name="ngaysinh"
													as={Input}
													sx={{
														...inputStyles,
														fontSize: '13px',
														padding: '2px',
														marginTop: '1px',
														maxWidth: '60%'
													}}
												/>
											</Stack>
										</Stack>

										<Stack flexDirection={'row'} mt={1}>
											<Box sx={{ backgroundColor: '#FFFFFF' }} p={'1px'} >&nbsp;&nbsp;&nbsp;&nbsp;</Box>
											<Box sx={{ backgroundColor: '#f75d59', borderBottomRightRadius: 11, borderTopRightRadius: 11 }} alignContent={'center'} p={'1px'}>
												<Typography sx={{ color: '#FFFFFF', fontSize: '13px' }} fontFamily={'"Arima", system-ui'} mt={"1px"}>&nbsp;&nbsp;CHỨNG CHỈ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
											</Box>
										</Stack>

									</Box>

									<Box bgcolor={"common.white"} flexDirection={'column'} m={2}>
										<Typography
											level='h4'
											fontFamily={'"Arima", system-ui'}
											sx={{
												color: '#f75d59',
												fontWeight: '700'
											}}
										>
											Mục Tiêu Nghề Nghiệp
										</Typography>
										<Divider
											sx={{
												backgroundColor: '#f75d59',
												padding: '1px',
												mt: 1,
												mb: 1
											}}
										/>

										<Field
											name="muctieu"
											as={Textarea}
											sx={{
												fontSize: '16px',
												padding: '2px',
												marginTop: '1px',
												border: 'none',
												outline: 'none',
												boxShadow: 'none',
												fontFamily: '"Arima", system-ui',
												color: '#000',
												backgroundColor: 'transparent',
											}}
											fullWidth
											placeholder="Mục tiêu nghề nghiệp"
										/>
										<Box
											sx={{
												position: 'relative',
												cursor: 'pointer',
												'&:hover': {
													'& .plus-sign': {
														opacity: 1,
													},
												},
											}}
										>
											<Typography
												level='h4'
												fontFamily={'"Arima", system-ui'}
												sx={{
													color: '#f75d59',
													fontWeight: '700',
													mt: 1,
												}}
											>
												Học Vấn
											</Typography>
											<Tooltip title="Thêm" placement="right" arrow>
												<Typography
													className="plus-sign"
													sx={{
														position: 'absolute',
														top: '50%',
														left: '98%',
														transform: 'translate(-50%, -50%)',
														fontSize: '24px',
														color: '#f75d59',
														opacity: 0,
														transition: 'opacity 0.3s',
													}}
													onClick={() => setFieldValue("hocvan", [...values.hocvan, { name: '', vitri: '', start: '', end: '', mota: '' }])}
												>
													+
												</Typography>
											</Tooltip>
										</Box>
										<Divider
											sx={{
												backgroundColor: '#f75d59',
												padding: '1px',
												mt: 1,
												mb: 2
											}}
										/>
										{values.hocvan.map((hocvan, index) => (
											<Box display={'grid'} flexDirection={'row'} gridTemplateColumns={'10px 1fr'}>
												<Box alignItems={'center'} justifyItems={'center'} mr={1}>
													<Box width={12} height={12} borderRadius={'50%'} sx={{ backgroundColor: '#f75d59' }} />
													<Divider
														sx={{
															backgroundColor: '#f75d59',
															padding: '1px',
															height: '85%'
														}}

														orientation="vertical"
													/>
												</Box>
												<Box key={index}>
													<Field
														name={`hocvan.${index}.name`}
														as={Input}
														sx={{
															fontSize: '16px',
															fontWeight: '600',
															color: '#000',
															fontFamily: '"Arima", system-ui',
															padding: '2px',
															border: 'none',
															outline: 'none',
															boxShadow: 'none',
															backgroundColor: 'transparent',

														}}
														size='xs'
														fullWidth
														placeholder="Ngành học/môn học"
													/>
													<Box display={'flex'} flexDirection={'row'}>
														<Typography
															sx={{
																color: '#000',
																fontFamily: '"Arima", system-ui',
															}}
														>
															Trường:
														</Typography>
														<Field
															name={`hocvan.${index}.vitri`}
															as={Input}
															sx={{
																fontSize: '15px',
																color: '#000',
																fontFamily: '"Arima", system-ui',
																padding: '2px',
																border: 'none',
																outline: 'none',
																boxShadow: 'none',
																backgroundColor: 'transparent',

															}}
															size='xs'
															fullWidth
															placeholder="Ngành học/môn học"
														/>
													</Box>

													<Box display={'flex'} flexDirection={'row'}>
														<Typography
															sx={{
																color: '#000',
																fontFamily: '"Arima", system-ui',
															}}
														>
															Thời gian:
														</Typography>
														<Field
															name={`hocvan.${index}.start`}
															as={Input}
															sx={{
																fontSize: '15px',
																color: '#000',
																fontFamily: '"Arima", system-ui',
																padding: '2px',
																border: 'none',
																outline: 'none',
																boxShadow: 'none',
																backgroundColor: 'transparent',
																width: '20%',
																"& .MuiInput-input": {
																	textAlign: 'center',
																},
															}}
															size='xs'
															placeholder="Bắt đầu"
														/>
														<Typography
															sx={{
																fontSize: '15px',
																color: '#000',
																fontFamily: '"Arima", system-ui',
																ml: 1,
																mr: 1
															}}
														>
															-
														</Typography>
														<Field
															name={`hocvan.${index}.end`}
															as={Input}
															sx={{
																fontSize: '15px',
																color: '#000',
																fontFamily: '"Arima", system-ui',
																padding: '2px',
																border: 'none',
																outline: 'none',
																boxShadow: 'none',
																backgroundColor: 'transparent',
																width: '20%',
																"& .MuiInput-input": {
																	textAlign: 'center',
																},
															}}
															size='xs'
															placeholder="Kết thúc"
														/>
													</Box>

													<Box display={'flex'} flexDirection={'row'}>
														<Typography
															sx={{
																color: '#000',
																fontFamily: '"Arima", system-ui',
															}}
														>
															Thành tích:
														</Typography>
														<Field
															name={`hocvan.${index}.mota`}
															as={Textarea}
															sx={{
																fontSize: '15px',
																color: '#000',
																fontFamily: '"Arima", system-ui',
																padding: '2px',
																border: 'none',
																outline: 'none',
																boxShadow: 'none',
																backgroundColor: 'transparent',
																width: '80%'
															}}
															size='xs'
															fullWidth
															placeholder="Mô tả thành tích trong quá trình học"
														/>
													</Box>
												</Box>
											</Box>
										))}

										<Box
											sx={{
												position: 'relative',
												cursor: 'pointer',
												'&:hover': {
													'& .plus-sign': {
														opacity: 1,
													},
												},
											}}
										>
											<Typography
												level='h4'
												fontFamily={'"Arima", system-ui'}
												sx={{
													color: '#f75d59',
													fontWeight: '700',
													mt: 1,
												}}
											>
												Kinh Nghiệm Làm Việc
											</Typography>
											<Tooltip title="Thêm" placement="right" arrow>
												<Typography
													className="plus-sign"
													sx={{
														position: 'absolute',
														top: '50%',
														left: '98%',
														transform: 'translate(-50%, -50%)',
														fontSize: '24px',
														color: '#f75d59',
														opacity: 0,
														transition: 'opacity 0.3s',
													}}
													onClick={() => setFieldValue("hocvan", [...values.hocvan, { name: '', vitri: '', start: '', end: '', mota: '' }])}
												>
													+
												</Typography>
											</Tooltip>
										</Box>
										<Divider
											sx={{
												backgroundColor: '#f75d59',
												padding: '1px',
												mt: 1,
												mb: 2
											}}
										/>
									</Box>
								</Box>
							</Form>
						)}
					</Formik>

				</Box>
			</Stack>
			<Transition in={open} timeout={400}>
				{(state: string) => (
					<Modal
						keepMounted
						open={!['exited', 'exiting'].includes(state)}
						onClose={() => setOpen(false)}
						slotProps={{
							backdrop: {
								sx: {
									opacity: 0,
									backdropFilter: 'none',
									transition: `opacity 400ms, backdrop-filter 400ms`,
									...{
										entering: { opacity: 1, backdropFilter: 'blur(8px)' },
										entered: { opacity: 1, backdropFilter: 'blur(8px)' },
									}[state],
								},
							},
						}}
						sx={[
							state === 'exited'
								? { visibility: 'hidden' }
								: { visibility: 'visible' },
						]}
					>
						<ModalDialog
							sx={{
								opacity: 0,
								transition: `opacity 300ms`,
								...{
									entering: { opacity: 1 },
									entered: { opacity: 1 },
								}[state],
							}}
						>
							<ModalClose />
							<DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
							<Divider />
							<DialogContent>

							</DialogContent>
						</ModalDialog>
					</Modal>
				)}
			</Transition>
		</CssVarsProvider>
	);
}
