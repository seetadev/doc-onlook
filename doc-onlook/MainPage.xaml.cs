﻿using System;
using System.Collections.Generic;
using System.IO;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Input;
using System.Diagnostics;
using Windows.Storage;
using Windows.UI.Popups;
using Windows.Storage.Pickers;
using Windows.Storage.Provider;
using Windows.Storage.Search;
using System.Threading.Tasks;
using Windows.Networking.Sockets;
using Windows.Storage.Streams;
using System.Runtime.InteropServices.WindowsRuntime;
using System.Text;
using System.Text.RegularExpressions;


// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=402352&clcid=0x409

namespace doc_onlook
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class MainPage : Page
    {
        bool isReceivingFile = false;
        int fileReceptionProgress = 0;

        public MainPage()
        {
            this.InitializeComponent();
            FillSampleFiles();
            FillCarousel();
            RunTCPListener();
        }

        // Fill the local files list:
        public async void FillLocalList()
        {
            List<StorageFile> items = await GetLocalFiles();
            LocalListView.ItemsSource = items;
        }

        // Fill a couple of 'Get Started' HTML files
        public async void FillSampleFiles()
        {
                        
            StorageFolder localFolder = ApplicationData.Current.LocalFolder;

            string AssetFile = @"Assets\TestPage1.html";
            StorageFolder InstallationFolder = Windows.ApplicationModel.Package.Current.InstalledLocation;
            StorageFile file = await InstallationFolder.GetFileAsync(AssetFile);
            try
            {
                StorageFile AppDataFile = await ApplicationData.Current.LocalFolder.GetFileAsync("TestPage1.html");
            }
            catch(FileNotFoundException e)
            {
                await file.CopyAsync(localFolder);
            }

            AssetFile = @"Assets\TestPage2.html";
            file = await InstallationFolder.GetFileAsync(AssetFile);
            try
            {
                StorageFile AppDataFile = await ApplicationData.Current.LocalFolder.GetFileAsync("TestPage2.html");
            }
            catch (FileNotFoundException e)
            {
                await file.CopyAsync(localFolder);
            }

            FillLocalList();
        }

        public async Task<List<StorageFile>> GetLocalFiles()
        {
            StorageFolder localFolder = ApplicationData.Current.LocalFolder;
            StorageFileQueryResult queryResult =  localFolder.CreateFileQuery();
            IReadOnlyList<StorageFile> fileList = await queryResult.GetFilesAsync();
            List<StorageFile> localList = new List<StorageFile>();
            foreach (StorageFile file in fileList)
            {
                localList.Add(file);
            }
            return localList;
        }

        public void FillCarousel()
        {
            WebView TestView = (WebView)this.FindName("testview_1");
            TestView.Navigate(new Uri("ms-appx-web:///assets/Hello.html"));
        }

        async private void SaveToDeviceBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                FileSavePicker savePicker = new FileSavePicker();
                savePicker.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;
                savePicker.FileTypeChoices.Add("Plain Text", new List<string>() { ".txt" });
                savePicker.SuggestedFileName = "New Document";

                StorageFile file = await savePicker.PickSaveFileAsync();
                if (file != null)
                {
                    CachedFileManager.DeferUpdates(file);
                    await FileIO.WriteTextAsync(file, file.Name);
                    FileUpdateStatus status = await CachedFileManager.CompleteUpdatesAsync(file);
                    if (status == FileUpdateStatus.Complete)
                    {
                        MessageDialog dialog = new MessageDialog("File Saved.");
                        await dialog.ShowAsync();
                    }
                    else
                    {
                        MessageDialog dialog = new MessageDialog("We couldn't save the file.");
                        await dialog.ShowAsync();
                    }
                }
                else
                {
                    MessageDialog dialog = new MessageDialog("Operation cancelled.");
                    await dialog.ShowAsync();
                }
            }
            catch(Exception exc)
            {
                MessageDialog dialog = new MessageDialog("Something occured: "+exc.ToString());
                await dialog.ShowAsync();
            }
            
        }

        private async void FileListItem_Tapped(object sender, TappedRoutedEventArgs e)
        {
            StackPanel fileItem = (StackPanel)sender;
            string fileName = ((TextBlock)fileItem.Children[0]).Text;
            string fileType = ((TextBlock)fileItem.Children[1]).Text;
            StorageFile localFile = await GetLocalFile(fileName, fileType);
            DisplayDoc(localFile);
        }

        public async void DisplayDoc(StorageFile localFile)
        {
            var read = await FileIO.ReadTextAsync(localFile);
            var CurrentFileBuffer = read;
            ((WebView)this.FindName("testview_1")).NavigateToString(CurrentFileBuffer);
        }

        public async Task<StorageFile> GetLocalFile(string fileName, string fileType)
        {
            try
            {
                StorageFile localFile = await ApplicationData.Current.LocalFolder.GetFileAsync(fileName+fileType);
                return localFile;
            }
            catch(Exception exc){
                Debug.WriteLine("Exception: " + exc.ToString());
                return null;
            }
            
        }

        public async void RunTCPListener()
        {
            StreamSocketListener listener = new StreamSocketListener();
            await listener.BindServiceNameAsync("2112");
            listener.ConnectionReceived += OnConnection;
        }

        public async void NotifyUser(string Message)
        {
            MessageDialog dialog = new MessageDialog(Message);
            await dialog.ShowAsync();
        }

        public int getContentLength(string content)
        {
            Regex regex = new Regex("Content-Length: ([0-9]*)");
            Match match = regex.Match(content);
            if (match.Success)
            {
                return int.Parse(match.Groups[1].Value);
            }
            return 0;
        }
        
        private async void OnConnection( StreamSocketListener sender, StreamSocketListenerConnectionReceivedEventArgs args)
        {
            using (IInputStream inStream = args.Socket.InputStream)
            {
                DataReader reader = new DataReader(inStream);
                reader.InputStreamOptions = InputStreamOptions.Partial;
                int contentLength = 0;
                uint numReadBytes;
                string totalContent = "";

                IOutputStream outStream = args.Socket.OutputStream;

                do
                {
                    numReadBytes = await reader.LoadAsync(1 << 20);  // "Hangs" when all data is read until the client cancels the connection, e.g. numReadBytes == 0

                    if (numReadBytes > 0)
                    {
                        byte[] tmpBuf = new byte[numReadBytes];
                        reader.ReadBytes(tmpBuf);
                        string result = Encoding.UTF8.GetString(tmpBuf).TrimEnd('\0');
                        Debug.WriteLine(result);
                        string[] contents = Regex.Split(result,"\r\n\r\n");
                        if (getContentLength(result)!= 0)
                        {
                            contentLength = getContentLength(result);
                            Debug.WriteLine("Total content length: " + contentLength);
                        }
                        string content;
                        if (contents.Length > 1)
                        {
                            content = contents[1];
                        }
                        else
                        {
                            content = contents[0];
                        }
                        totalContent += content;
                        if (totalContent.Length == contentLength)
                        {
                            Debug.WriteLine("Read all data.");
                            IBuffer replyBuff = tmpBuf.AsBuffer();
                            await outStream.WriteAsync(replyBuff);
                            NotifyUser("Recieved new data");
                            break;
                        }
                        
                    }
                } while (numReadBytes > 0);
            }
            Debug.WriteLine("Finished reading");
        }

    }
}
