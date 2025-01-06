import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CssVarsProvider } from "@mui/joy/styles";
import { Avatar, Box, Button, Divider, IconButton, Input, Stack, Textarea, Tooltip, Typography } from "@mui/joy";
import Header from "../../components/Header";
import * as Yup from "yup";
import { Field, Form, Formik } from 'formik';
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RecommendIcon from '@mui/icons-material/Recommend';
import useAppDispatch from '../../hooks/useAppDispatch';
import { startLoading, stopLoading } from '../../redux/slice/loadingSlice';
import { genCv } from '../../services/cvApi';
import { getCv } from '../../services/cvApi';
import { updateCv } from '../../services/cvApi';
import { updateAvatarCv } from '../../services/cvApi';
import { toast } from 'react-toastify';

const FormCv = Yup.object().shape({
	name: Yup.string(),
	universityName: Yup.string(),
	email: Yup.string().email('Email không hợp lệ'),
	phone: Yup.string(),
	address: Yup.string(),
	dob: Yup.string(),
	target: Yup.string(),
	educations: Yup.array().of(
		Yup.object().shape({
			name: Yup.string(),
			universityName: Yup.string(),
			startDate: Yup.string(),
			endDate: Yup.string(),
			description: Yup.string(),
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
	fontSize: '13px',
	padding: '2px',
	marginTop: '1px'
}

const sharedSx = {
	fontSize: '15px',
	color: '#000',
	fontFamily: '"Arima", system-ui',
	padding: '2px',
	border: 'none',
	outline: 'none',
	boxShadow: 'none',
	backgroundColor: 'transparent',
};

const formikSx = {
	position: 'absolute',
	top: '50%',
	left: '95%',
	transform: 'translate(-50%, -50%)',
	fontSize: '24px',
	color: '#f75d59',
	opacity: 0,
	transition: 'opacity 0.3s',
}

const typographySx = {
	color: '#000',
	fontFamily: '"Arima", system-ui',
}

const boxSX = {
	position: 'relative',
	cursor: 'pointer',
	'&:hover': {
		'& .plus-sign': {
			opacity: 1,
		},
	},
}

const dividerSx = {
	backgroundColor: '#f75d59',
	padding: '1px',
	mt: 1,
	mb: 2
}

export default function Layout1() {
	const [previewUrlAvata, setPreviewUrlAvata] = useState<string | null>(null);
	const dispatch = useAppDispatch();
	const [infoCv, setInfoCv] = useState({
		layout: 1,
		name: '',
		nameCv: '',
		position: '',
		email: '',
		phone: '',
		address: '',
		avatar: null,
		dob: '',
		target: '',
		certificates: [{
			name: '',
		}],
		hobbies: [{
			name: '',
		}],
		educations: [{
			expertise: '',
			universityName: '',
			startDate: '',
			endDate: '',
			description: '',
		}],
		projects: [{
			name: '',
			startDate: '',
			endDate: '',
			quantity: '',
			github: '',
			description: '',
		}]
	});

	const onDrop = useCallback((acceptedFiles: File[]) => {
		const file = acceptedFiles[0];
		setPreviewUrlAvata(URL.createObjectURL(file))
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.jpg', '.jpeg', '.png', '.gif']
		}
	});

	const handleClick = async () => {
		const result = await dispatch(genCv("1"));

		if (genCv.fulfilled.match(result)) {
			const blob = result.payload.response;

			if (blob instanceof Blob) {
				const pdfURL = URL.createObjectURL(blob);
				window.open(pdfURL);
			} else {
				console.error("Result is not a valid Blob");
			}
		} else {
			console.error("Failed to fetch PDF");
		}
	};

	const handleDowload = async (nameCv) => {
		const result = await dispatch(genCv("1"));

		if (genCv.fulfilled.match(result)) {
			const blob = result.payload.response;

			if (blob instanceof Blob) {
				const url = URL.createObjectURL(blob);

				const link = document.createElement("a");
				link.href = url;
				link.download = nameCv;
				document.body.appendChild(link);

				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
			} else {
				console.error("Result is not a valid Blob");
			}
		} else {
			console.error("Failed to fetch PDF");
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				dispatch(startLoading)
				const result = await dispatch(getCv("1"));
				if (getCv.fulfilled.match(result)) {
					const response = result.payload.response;
					if (response) {
						setInfoCv({
							layout: 1,
							name: response.name,
							nameCv: response.nameCv,
							position: response.position,
							email: response.email,
							phone: response.phone,
							address: response.address,
							avatar: response.avatar,
							dob: response.dob,
							target: response.target,
							certificates: response.certificates || [],
							hobbies: response.hobbies || [],
							educations: response.educations || [],
							projects: response.projects || [],
						});
						setPreviewUrlAvata(response.avatar)
					}
				}
				dispatch(stopLoading)
			}
			catch (error) {
				console.error("Error fetching data:", error);
			}
		}
		fetchData();
	}, [dispatch]);

	useEffect(() => {
		console.log("InfoCv before setting:", infoCv);
	}, [infoCv]);

	if (!infoCv || Object.keys(infoCv).length === 0) {
		return <div>Loading...</div>;
	}

	return (
		<CssVarsProvider disableTransitionOnChange>
			<Header />

			<Stack display={'flex'} flexDirection={'row'} >
				<Box width={'100%'}>
					<Formik
						enableReinitialize
						initialValues={{
							layout: 1,
							name: infoCv.name,
							nameCv: infoCv.nameCv,
							position: infoCv.position || "",
							email: infoCv.email || "",
							phone: infoCv.phone || "",
							address: infoCv.address || "",
							avatar: infoCv.avatar || "",
							dob: infoCv.dob || "",
							target: infoCv.target || "",
							certificates: infoCv.certificates?.map(cert => ({
								name: cert.name || "",
							})) || [{ name: "" }],
							hobbies: infoCv.hobbies?.map(hobby => ({
								name: hobby.name || "",
							})) || [{ name: "" }],
							educations: infoCv.educations?.map(education => ({
								expertise: education.expertise || "",
								universityName: education.universityName || "",
								startDate: education.startDate || "",
								endDate: education.endDate || "",
								description: education.description || "",
							})) || [{
								name: "",
								universityName: "",
								startDate: "",
								endDate: "",
								description: "",
							}],
							projects: infoCv.projects?.map(project => ({
								name: project.name || "",
								startDate: project.startDate || "",
								endDate: project.endDate || "",
								quantity: project.quantity || "",
								github: project.github || "",
								description: project.description || "",
							})) || [{
								name: "",
								startDate: "",
								endDate: "",
								quantity: "",
								github: "",
								description: "",
							}],
						}}
						// validationSchema={FormCv}
						onSubmit={async (values, { setSubmitting }) => {
							try {
								dispatch(startLoading());
								const result = await dispatch(updateCv(values));
								dispatch(stopLoading());

								dispatch(startLoading)
								const formData = new FormData()
								if (values.avatar instanceof File) {
									formData.append("avatar", values.avatar)
								}
								formData.append("layout", "1")
								const resultAvatar = await dispatch(updateAvatarCv(formData))
								dispatch(stopLoading)

								if (result?.payload?.response?.success && resultAvatar?.payload?.response?.success) {
									toast.success('Cập nhật thông tin CV thành công')
								} else {
									toast.error('Cập nhật thông tin CV không thành công');
								}
							} catch (error) {
								toast.error('Đã có lỗi xảy ra.');
							} finally {
								setSubmitting(false);
							}
						}}
					>
						{({ isSubmitting, errors, touched, values, setFieldValue }) => (
							<Form>
								<Stack direction={'row'} p={2} justifyContent={'space-between'}>
									<Field
										name="nameCv"
										as={Input}
										placeholder="Cv chưa đặt tên"
									/>

									<Stack direction={'row'} gap={2}>
										<Button
											style={{ backgroundColor: '#00b14f' }}
											startDecorator={<RemoveRedEyeOutlinedIcon />}
											onClick={() => handleClick()}
										>
											Xem trước
										</Button>
										<Button
											style={{ backgroundColor: '#00b14f' }}
											startDecorator={<ArrowDownwardOutlinedIcon />}
											onClick={() => handleDowload(values.nameCv)}
										>
											Tải xuống
										</Button>
										<Button
											style={{ backgroundColor: '#00b14f' }}
											startDecorator={<SaveIcon />}
											type='submit'
										>
											Lưu lại
										</Button>
									</Stack>
								</Stack>
								<Divider />
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
										mb: 2,
										mt: 1,
										border: '1px solid darkgray'
									}}
								>

									<Box bgcolor={"#2b2b2b"} pb={1}>
										<Box
											display={'flex'}
											flexDirection={"column"}
											justifyContent={'center'}
											alignItems={'center'}
											margin={2}
										>
											<Box position={'relative'} mb={2}>
												<Box {...getRootProps()} sx={{ position: 'relative' }}>
													<input
														{...getInputProps()}
														onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
															const file = event.currentTarget.files?.[0];
															if (file) {
																setPreviewUrlAvata(URL.createObjectURL(file));
																setFieldValue('avatar', file);
															}
														}}
													/>
													<Avatar
														sx={{
															height: '180px',
															width: '180px',
															overflow: 'hidden',
															cursor: 'pointer',
														}}
													>
														{previewUrlAvata ? (
															<img
																src={previewUrlAvata}
																alt="Preview"
																style={{
																	objectFit: 'cover',
																	width: '100%',
																	height: '100%',
																}}
															/>
														) : (
															<Typography
																level="body-xs"
																textAlign="center"
																sx={{ color: '#999', padding: 1 }}
															>
																Kéo thả hình ảnh vào đây hoặc click để chọn file
															</Typography>
														)}
													</Avatar>
												</Box>

												<IconButton
													{...getRootProps()}
													aria-label="upload new picture"
													size="sm"
													variant="solid"
													sx={{
														position: 'absolute',
														zIndex: 2,
														borderRadius: '50%',
														right: 20,
														bottom: 5,
													}}
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


											<Field
												name="position"
												as={Input}
												startDecorator={
													<Typography
														fontSize={'19px'}
														fontWeight={'600'}
														fontFamily={'"Arima", system-ui'}
														sx={{ color: '#f75d59' }}
													>
														Vị trí:
													</Typography>
												}
												sx={{
													...inputStyles,
													fontSize: '19px',
													fontWeight: '600',
													color: '#f75d59',
													maxWidth: '65%',
												}}
											/>
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
													sx={inputStyles}
												/>
											</Box>
											<Box display={'flex'} alignItems={'center'}>
												<PhoneIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Sđt:
												</Typography>
												<Field
													name="phone"
													as={Input}
													sx={inputStyles}
												/>
											</Box>
											<Box display={'flex'} alignItems={'center'}>
												<RoomIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Địa chỉ:
												</Typography>
												<Field
													name="address"
													as={Input}
													sx={inputStyles}
												/>
											</Box>
											<Stack direction={'row'} alignItems={'center'}>
												<CalendarMonthIcon sx={{ fontSize: '18px', color: '#FFF', marginBottom: '3px' }} /> &nbsp;
												<Typography level='body-sm' fontFamily={'"Arima", system-ui'} sx={{ color: '#FFF' }}>
													Ngày sinh:
												</Typography>
												<Field
													name="dob"
													as={Input}
													sx={inputStyles}
												/>
											</Stack>
										</Stack>
										{/* {values.certificates.length !== 0 && ( */}
											<Stack gap={1}>
												<Box sx={boxSX}>
													<Stack direction={'row'} mt={1}>
														<Box sx={{ backgroundColor: '#FFFFFF' }} p={'1px'} >&nbsp;&nbsp;&nbsp;&nbsp;</Box>
														<Box sx={{ backgroundColor: '#f75d59', borderBottomRightRadius: 11, borderTopRightRadius: 11 }} alignContent={'center'} p={'1px'}>
															<Typography sx={{ color: '#FFFFFF', fontSize: '13px' }} fontFamily={'"Arima", system-ui'} mt={"1px"}>&nbsp;&nbsp;CHỨNG CHỈ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
														</Box>
													</Stack>

													<Tooltip title="Thêm" placement="right" arrow>
														<Typography
															className="plus-sign"
															sx={formikSx}
															onClick={() => setFieldValue("certificates", [...values.certificates, { name: '' }])}
														>
															+
														</Typography>
													</Tooltip>

													<Tooltip title="Xoá chứng chỉ cuối cùng" arrow>
														<Typography
															className="plus-sign"
															sx={{ ...formikSx, top: '50%', left: '90%', }}
															onClick={() => {
																const updatedChungchi = [...values.certificates];
																updatedChungchi.pop();
																setFieldValue("certificates", updatedChungchi);
															}}
														>
															-
														</Typography>
													</Tooltip>
												</Box>
												{values.certificates.map((certificates, index) => (
													<Stack direction={'row'} ml={3} alignItems={'start'}>
														<CheckCircleIcon sx={{ color: '#f75d59', fontSize: '19px' }} /> &nbsp;
														<Field
															name={`certificates.${index}.name`}
															as={Textarea}
															sx={{ ...inputStyles, width: '80%' }}
															size='xs'
															fullWidth
															placeholder="tên chứng chỉ"
														/>
													</Stack>
												))}
											</Stack>
										{/* )} */}

										{/* {values.hobbies.length !== 0 && ( */}
											<Stack gap={1}>
												<Box sx={boxSX}>
													<Stack direction={'row'} mt={1}>
														<Box sx={{ backgroundColor: '#FFFFFF' }} p={'1px'} >&nbsp;&nbsp;&nbsp;&nbsp;</Box>
														<Box sx={{ backgroundColor: '#f75d59', borderBottomRightRadius: 11, borderTopRightRadius: 11 }} alignContent={'center'} p={'1px'}>
															<Typography sx={{ color: '#FFFFFF', fontSize: '13px' }} fontFamily={'"Arima", system-ui'} mt={"1px"}>&nbsp;&nbsp;SỞ THÍCH&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
														</Box>
													</Stack>

													<Tooltip title="Thêm" placement="right" arrow>
														<Typography
															className="plus-sign"
															sx={formikSx}
															onClick={() => setFieldValue("hobbies", [...values.hobbies, { name: '' }])}
														>
															+
														</Typography>
													</Tooltip>

													<Tooltip title="Xoá sở thích cuối cùng" arrow>
														<Typography
															className="plus-sign"
															sx={{ ...formikSx, top: '50%', left: '90%', }}
															onClick={() => {
																const updatedSothich = [...values.hobbies];
																updatedSothich.pop();
																setFieldValue("hobbies", updatedSothich);
															}}
														>
															-
														</Typography>
													</Tooltip>
												</Box>
												{values.hobbies.map((hobbies, index) => (
													<Stack ml={3}>
														<Field
															name={`hobbies.${index}.name`}
															as={Textarea}
															sx={{ ...inputStyles, width: '80%' }}
															size='xs'
															placeholder="sở thích của bạn"
														/>
													</Stack>
												))}
											</Stack>
										{/* )} */}
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
										<Divider sx={dividerSx}/>

										<Field
											name="target"
											as={Textarea}
											sx={{...sharedSx, fontSize: '16px', marginTop: '1px'}}
											fullWidth
											placeholder="Mục tiêu nghề nghiệp"
										/>
										<Box sx={boxSX}>
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
													sx={{...formikSx, left: '98%'}}
													onClick={() => setFieldValue("educations", [...values.educations, { name: '', universityName: '', startDate: '', endDate: '', description: '' }])}
												>
													+
												</Typography>
											</Tooltip>

											<Tooltip title="Xoá học vấn cuối cùng " arrow>
												<Typography
													className="plus-sign"
													sx={{...formikSx, left: '90%'}}
													onClick={() => {
														const updatedHocvan = [...values.educations];
														updatedHocvan.pop();
														setFieldValue("educations", updatedHocvan);
													}}
												>
													-
												</Typography>
											</Tooltip>
										</Box>
										<Divider sx={dividerSx}/>
										{values.educations.map((educations, index) => (
											<Stack direction={'row'}>
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
														name={`educations.${index}.expertise`}
														as={Input}
														sx={{
															...sharedSx,
															fontSize: '17px',
															fontWeight: '600',
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
															name={`educations.${index}.universityName`}
															as={Input}
															sx={sharedSx}
															size='xs'
															fullWidth
															placeholder="Tên trường học"
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
															name={`educations.${index}.startDate`}
															as={Input}
															sx={{
																...sharedSx,
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
																...typographySx,
																ml: 1,
																mr: 1
															}}
														>
															-
														</Typography>
														<Field
															name={`educations.${index}.endDate`}
															as={Input}
															sx={{
																...sharedSx,
																width: '20%',
																"& .MuiInput-input": {
																	textAlign: 'center',
																},
															}}
															size='xs'
															placeholder="Kết thúc"
														/>
													</Box>

													<Field
														name={`educations.${index}.description`}
														as={Textarea}
														sx={sharedSx}
														placeholder="Mô tả thành tích trong quá trình học"
													/>
												</Box>
											</Stack>
										))}

										<Box sx={boxSX}>
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
													sx={{...formikSx, left: '98%'}}
													onClick={() => setFieldValue("projects", [...values.projects, { name: '', universityName: '', startDate: '', endDate: '', description: '' }])}
												>
													+
												</Typography>
											</Tooltip>

											<Tooltip title="Xoá dư án cuối cùng " arrow>
												<Typography
													className="plus-sign"
													sx={{...formikSx, left: '90%'}}
													onClick={() => {
														const updatedDuan = [...values.projects];
														updatedDuan.pop();
														setFieldValue("projects", updatedDuan);
													}}
												>
													-
												</Typography>
											</Tooltip>
										</Box>
										<Divider sx={dividerSx}/>
										{values.projects.map((projects, index) => (
											<Stack direction={'row'}>
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
														name={`projects.${index}.name`}
														as={Input}
														sx={{
															...sharedSx,
															fontSize: '18px',
															fontWeight: '600',
														}}
														size='xs'
														fullWidth
														placeholder="Tên dự án"
													/>

													<Stack direction={'row'}>
														<Typography sx={typographySx}>Thời gian:</Typography>
														<Field
															name={`projects.${index}.startDate`}
															as={Input}
															sx={{
																...sharedSx,
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
																...typographySx,
																ml: 1,
																mr: 1
															}}
														>
															-
														</Typography>
														<Field
															name={`projects.${index}.endDate`}
															as={Input}
															sx={sharedSx}
															size='xs'
															placeholder="Kết thúc"
														/>
													</Stack>

													<Stack direction={'row'}>
														<Typography sx={typographySx}>
															Số lượng người tham gia:
														</Typography>
														<Field
															name={`projects.${index}.quantity`}
															as={Input}
															sx={sharedSx}
															size='xs'
															placeholder="Số lượng người tham gia"
														/>
													</Stack>

													<Stack direction={'row'}>
														<Typography sx={typographySx}>
															Github:
														</Typography>
														<Field
															name={`projects.${index}.github`}
															as={Input}
															sx={{
																...sharedSx,
																width: '68%'
															}}
															size='xs'
															fullWidth
															placeholder="https://github.com/example"
														/>
													</Stack>

													<Field
														name={`projects.${index}.description`}
														as={Textarea}
														sx={{
															...sharedSx,
															width: '76%'
														}}
														placeholder="Mô tả dự án của bạn"
													/>
												</Box>
											</Stack>
										))}
									</Box>
								</Box>
							</Form>
						)}
					</Formik>
				</Box>
			</Stack>
		</CssVarsProvider>
	);
}
