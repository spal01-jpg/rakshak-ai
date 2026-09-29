#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <winsock2.h>
#include <ws2tcpip.h>
#include <shellapi.h>
#include <stdio.h>
#include <stdlib.h>

#pragma comment(lib, "ws2_32.lib")

int is_port_open(const char* ip, int port) {
    WSADATA wsaData;
    if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
        return 0;
    }

    SOCKET sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    if (sock == INVALID_SOCKET) {
        WSACleanup();
        return 0;
    }

    u_long mode = 1;
    ioctlsocket(sock, FIONBIO, &mode); // Non-blocking

    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(port);
    addr.sin_addr.s_addr = inet_addr(ip);

    connect(sock, (struct sockaddr*)&addr, sizeof(addr));

    fd_set fdwrite;
    FD_ZERO(&fdwrite);
    FD_SET(sock, &fdwrite);

    struct timeval timeout;
    timeout.tv_sec = 0;
    timeout.tv_usec = 400000; // 400 ms

    int res = select(0, NULL, &fdwrite, NULL, &timeout);
    closesocket(sock);
    WSACleanup();

    return (res > 0);
}

int file_exists(const char* path) {
    DWORD dwAttrib = GetFileAttributesA(path);
    return (dwAttrib != INVALID_FILE_ATTRIBUTES && !(dwAttrib & FILE_ATTRIBUTE_DIRECTORY));
}

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    char currentDir[MAX_PATH];
    GetCurrentDirectoryA(MAX_PATH, currentDir);

    // 1. Check if server is already running on port 8000
    if (!is_port_open("127.0.0.1", 8000)) {
        // Find python executable
        char pythonPath[MAX_PATH];
        snprintf(pythonPath, sizeof(pythonPath), "%s\\.venv\\Scripts\\python.exe", currentDir);
        
        char cmdLine[1024];
        if (file_exists(pythonPath)) {
            snprintf(cmdLine, sizeof(cmdLine), "\"%s\" -m uvicorn server:app --host 127.0.0.1 --port 8000", pythonPath);
        } else {
            snprintf(cmdLine, sizeof(cmdLine), "python -m uvicorn server:app --host 127.0.0.1 --port 8000");
        }

        STARTUPINFOA si;
        PROCESS_INFORMATION pi;
        ZeroMemory(&si, sizeof(si));
        si.cb = sizeof(si);
        ZeroMemory(&pi, sizeof(pi));

        // Start server with CREATE_NO_WINDOW
        if (CreateProcessA(NULL, cmdLine, NULL, NULL, FALSE, CREATE_NO_WINDOW, NULL, currentDir, &si, &pi)) {
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
        }

        // Wait up to 5 seconds for server to boot
        for (int i = 0; i < 25; i++) {
            Sleep(200);
            if (is_port_open("127.0.0.1", 8000)) {
                break;
            }
        }
    }

    // 2. Locate browser to launch in standalone App mode
    const char* browserCandidates[] = {
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    };

    const char* chosenBrowser = NULL;
    for (int i = 0; i < 4; i++) {
        if (file_exists(browserCandidates[i])) {
            chosenBrowser = browserCandidates[i];
            break;
        }
    }

    if (chosenBrowser != NULL) {
        char appArgs[512];
        snprintf(appArgs, sizeof(appArgs), "--app=\"http://127.0.0.1:8000\" --window-size=1440,920");

        STARTUPINFOA bSi;
        PROCESS_INFORMATION bPi;
        ZeroMemory(&bSi, sizeof(bSi));
        bSi.cb = sizeof(bSi);
        ZeroMemory(&bPi, sizeof(bPi));

        char fullBrowserCmd[1024];
        snprintf(fullBrowserCmd, sizeof(fullBrowserCmd), "\"%s\" %s", chosenBrowser, appArgs);

        if (CreateProcessA(NULL, fullBrowserCmd, NULL, NULL, FALSE, 0, NULL, NULL, &bSi, &bPi)) {
            CloseHandle(bPi.hProcess);
            CloseHandle(bPi.hThread);
            return 0;
        }
    }

    // Fallback: Default web browser
    ShellExecuteA(NULL, "open", "http://127.0.0.1:8000", NULL, NULL, SW_SHOWNORMAL);
    return 0;
}
